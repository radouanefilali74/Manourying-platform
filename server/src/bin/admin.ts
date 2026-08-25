/**
 * The admin account CLI — the only way an admin account comes into existence.
 *
 *   npm --prefix server run admin -- create  --email a@b.c --name "Name" [--role owner]
 *   npm --prefix server run admin -- passwd  --email a@b.c
 *   npm --prefix server run admin -- disable --email a@b.c
 *   npm --prefix server run admin -- enable  --email a@b.c
 *   npm --prefix server run admin -- list
 *   npm --prefix server run admin -- sessions:revoke (--email a@b.c | --all)
 *
 * The password is NEVER an argv. It goes into shell history, and it is visible
 * in `ps` to every other user on the box for as long as the process runs. It is
 * either prompted for with echo suppressed, or generated here and printed once.
 */
import { randomBytes } from 'node:crypto';
import { pool } from '../db/pool.ts';
import { hashPassword } from '../lib/password.ts';

const ROLES = ['owner', 'operator', 'reviewer'] as const;
type Role = (typeof ROLES)[number];

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function has(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

/**
 * Reads a line from a TTY without echoing it, by reading raw keystrokes rather
 * than reaching into readline's internals.
 *
 * Off a TTY this returns empty, and the caller generates a passphrase instead —
 * which is the right behaviour for a non-interactive run: there is nowhere safe
 * for a password to come from in that case.
 */
async function promptSecret(label: string): Promise<string> {
  const input = process.stdin;
  if (!input.isTTY) return '';

  process.stdout.write(label);
  const wasRaw = input.isRaw;
  input.setRawMode(true);
  input.resume();

  try {
    let value = '';
    for await (const chunk of input) {
      const text = String(chunk);
      let done = false;

      for (const char of text) {
        if (char === '\r' || char === '\n') {
          done = true;
          break;
        }
        if (char === '') {
          // Ctrl-C: leave the terminal as we found it before dying.
          process.stdout.write('\n');
          input.setRawMode(wasRaw);
          process.exit(130);
        }
        if (char === '' || char === '\b') {
          value = value.slice(0, -1);
          continue;
        }
        // Ignore control characters; take everything else verbatim.
        if (char >= ' ') value += char;
      }

      if (done) break;
    }
    process.stdout.write('\n');
    return value;
  } finally {
    input.setRawMode(wasRaw);
    input.pause();
  }
}

/**
 * 24 characters from a 32-symbol alphabet ≈ 120 bits. Generated rather than
 * chosen, because an admin panel that can revoke every invite in the system is
 * not the place for a password somebody will remember unaided.
 */
function generatePassphrase(): string {
  const alphabet = 'abcdefghijkmnopqrstuvwxyz23456789';
  const bytes = randomBytes(24);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

async function readPassword(): Promise<{ password: string; generated: boolean }> {
  const first = await promptSecret('Password (leave blank to generate): ');
  if (!first) return { password: generatePassphrase(), generated: true };

  if (first.length < 12) fail('Too short — use at least 12 characters, or leave it blank.');

  const again = await promptSecret('Again: ');
  if (first !== again) fail('Those did not match.');
  return { password: first, generated: false };
}

async function create() {
  const email = flag('email')?.trim().toLowerCase() ?? fail('--email is required');
  const name = flag('name') ?? fail('--name is required');
  const role = (flag('role') ?? 'operator') as Role;

  if (!ROLES.includes(role)) fail(`--role must be one of ${ROLES.join(', ')}`);
  if (!email.includes('@')) fail('That does not look like an email address.');

  const { password, generated } = await readPassword();
  const hash = await hashPassword(password);

  try {
    const { rows } = await pool.query<{ id: number }>(
      `INSERT INTO admins (email, password_hash, display_name, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [email, hash, name, role],
    );
    console.log(`\n  created admin #${rows[0]?.id} ${email} (${role})`);
    if (generated) {
      console.log(`\n  password: ${password}`);
      console.log('  This is the only time it will be shown.\n');
    }
  } catch (error) {
    if ((error as { code?: string }).code === '23505') fail(`${email} already exists.`);
    throw error;
  }
}

async function passwd() {
  const email = flag('email')?.trim().toLowerCase() ?? fail('--email is required');
  const { password, generated } = await readPassword();
  const hash = await hashPassword(password);

  const { rowCount } = await pool.query('UPDATE admins SET password_hash = $1 WHERE email = $2', [
    hash,
    email,
  ]);
  if (!rowCount) fail(`No admin with address ${email}.`);

  // Changing a password invalidates every session it was ever used for. That is
  // the whole reason someone changes one in a hurry.
  const { rowCount: revoked } = await pool.query(
    `UPDATE admin_sessions s SET revoked_at = now()
       FROM admins a WHERE a.id = s.admin_id AND a.email = $1 AND s.revoked_at IS NULL`,
    [email],
  );

  console.log(`\n  password changed for ${email}; ${revoked ?? 0} session(s) revoked`);
  if (generated) console.log(`\n  password: ${password}\n  Shown once.\n`);
}

async function setDisabled(disabled: boolean) {
  const email = flag('email')?.trim().toLowerCase() ?? fail('--email is required');
  const { rowCount } = await pool.query(
    `UPDATE admins SET disabled_at = ${disabled ? 'now()' : 'NULL'} WHERE email = $1`,
    [email],
  );
  if (!rowCount) fail(`No admin with address ${email}.`);

  if (disabled) {
    await pool.query(
      `UPDATE admin_sessions s SET revoked_at = now()
         FROM admins a WHERE a.id = s.admin_id AND a.email = $1 AND s.revoked_at IS NULL`,
      [email],
    );
  }
  console.log(`\n  ${email} ${disabled ? 'disabled' : 'enabled'}`);
}

async function list() {
  const { rows } = await pool.query(
    `SELECT a.email, a.display_name, a.role, a.disabled_at, a.last_login_at,
            count(s.id) FILTER (WHERE s.revoked_at IS NULL AND s.expires_at > now()) AS live
       FROM admins a LEFT JOIN admin_sessions s ON s.admin_id = a.id
       GROUP BY a.id ORDER BY a.email`,
  );
  if (!rows.length) {
    console.log('\n  No admins yet. Create one:\n    npm --prefix server run admin -- create --email … --name …\n');
    return;
  }
  console.log('');
  for (const r of rows) {
    const state = r.disabled_at ? 'DISABLED' : `${r.live} live session(s)`;
    const seen = r.last_login_at ? new Date(r.last_login_at).toISOString().slice(0, 16) : 'never';
    console.log(`  ${r.email.padEnd(32)} ${r.role.padEnd(9)} last login ${seen}  ${state}`);
  }
  console.log('');
}

async function revokeSessions() {
  if (has('all')) {
    const { rowCount } = await pool.query(
      'UPDATE admin_sessions SET revoked_at = now() WHERE revoked_at IS NULL',
    );
    console.log(`\n  revoked ${rowCount ?? 0} session(s) — everybody is signed out`);
    return;
  }
  const email = flag('email')?.trim().toLowerCase() ?? fail('--email or --all is required');
  const { rowCount } = await pool.query(
    `UPDATE admin_sessions s SET revoked_at = now()
       FROM admins a WHERE a.id = s.admin_id AND a.email = $1 AND s.revoked_at IS NULL`,
    [email],
  );
  console.log(`\n  revoked ${rowCount ?? 0} session(s) for ${email}`);
}

const command = process.argv[2];

try {
  switch (command) {
    case 'create': await create(); break;
    case 'passwd': await passwd(); break;
    case 'disable': await setDisabled(true); break;
    case 'enable': await setDisabled(false); break;
    case 'list': await list(); break;
    case 'sessions:revoke': await revokeSessions(); break;
    default:
      console.error(`
  Usage: npm --prefix server run admin -- <command>

    create  --email a@b.c --name "Name" [--role owner|operator|reviewer]
    passwd  --email a@b.c
    disable --email a@b.c
    enable  --email a@b.c
    list
    sessions:revoke (--email a@b.c | --all)
`);
      process.exitCode = 1;
  }
} finally {
  await pool.end();
}
