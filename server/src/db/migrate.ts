/**
 * The migration runner.
 *
 * Plain SQL files in db/migrations, applied in lexical order, each inside one
 * transaction. Postgres DDL is transactional, so a file either applies whole or
 * not at all — there is no such thing as a half-applied migration here.
 *
 * Deliberately not Prisma or Drizzle. Several of this schema's invariants are
 * DDL that no ORM expresses well — partial unique indexes, multi-column CHECKs,
 * triggers for monotonicity and for freezing a sealed directive. Writing those
 * as raw-SQL escapes inside an ORM migration defeats the point of the ORM, and
 * this repo's style is already "a plain node script that does one thing".
 *
 *   npm --prefix server run db:migrate
 *   npm --prefix server run db:migrate -- --dry-run
 *
 * Migrations run as MIGRATE_DATABASE_URL (the owning role) when it is set,
 * falling back to DATABASE_URL. The two-role split is what makes audit_log
 * genuinely append-only: the API's role is never granted UPDATE or DELETE on it.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const MIGRATIONS_DIR = fileURLToPath(new URL('../../../db/migrations', import.meta.url));

const TRACKING_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version    text PRIMARY KEY,
    checksum   text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  );
`;

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

export type Migration = { version: string; sql: string; checksum: string };

export function loadMigrations(dir = MIGRATIONS_DIR): Migration[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((version) => {
      const sql = readFileSync(join(dir, version), 'utf8');
      return { version, sql, checksum: sha256(sql) };
    });
}

export async function migrate(client: pg.Client, opts: { dryRun?: boolean } = {}) {
  await client.query(TRACKING_TABLE);

  const { rows } = await client.query<{ version: string; checksum: string }>(
    'SELECT version, checksum FROM schema_migrations',
  );
  const applied = new Map(rows.map((r) => [r.version, r.checksum]));

  const pending: Migration[] = [];

  for (const migration of loadMigrations()) {
    const previous = applied.get(migration.version);
    if (previous === undefined) {
      pending.push(migration);
      continue;
    }
    // An applied migration whose bytes have changed means the database and the
    // repo disagree about what was run. Editing an applied migration is the
    // mistake; a new file is the fix.
    if (previous !== migration.checksum) {
      throw new Error(
        `${migration.version} was already applied, but its contents have changed.\n` +
          `    applied: ${previous}\n` +
          `    on disk: ${migration.checksum}\n` +
          '    Do not edit an applied migration — add a new one.',
      );
    }
  }

  if (pending.length === 0) {
    console.log('migrations: up to date');
    return [];
  }

  for (const migration of pending) {
    if (opts.dryRun) {
      console.log(`would apply ${migration.version}`);
      continue;
    }
    process.stdout.write(`applying ${migration.version} … `);
    try {
      await client.query('BEGIN');
      await client.query(migration.sql);
      await client.query('INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)', [
        migration.version,
        migration.checksum,
      ]);
      await client.query('COMMIT');
      console.log('ok');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log('failed');
      throw error;
    }
  }

  return pending;
}

// Run directly: `tsx src/db/migrate.ts`
if (import.meta.url === `file://${process.argv[1]}`) {
  const connectionString = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Set MIGRATE_DATABASE_URL (preferred) or DATABASE_URL.');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await migrate(client, { dryRun: process.argv.includes('--dry-run') });
  } catch (error) {
    console.error(`\nMigration failed:\n  ${(error as Error).message}\n`);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}
