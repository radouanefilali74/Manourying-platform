/**
 * The admin auth flow, end to end against a real database.
 *
 *   createdb manourying_test -O manourying_owner
 *   cp server/.env server/.env.test   # then point DATABASE_URL at manourying_test
 *   npm --prefix server test
 *
 * Skips itself, loudly, unless DATABASE_URL names a database ending in `_test`.
 * That guard is not politeness — this suite deletes every session and truncates
 * the admin it uses, and pointing it at the live database by accident should be
 * impossible rather than merely unlikely.
 *
 * It skips rather than fails when unconfigured, which is exactly why it is NOT
 * part of `npm run verify`: a gate that can silently skip is not a gate. It runs
 * from deploy/publish-api.sh instead, where a database always exists.
 *
 * Imports are static and the guard is a `skip` option, deliberately: registering
 * tests after a top-level `await import(…)` makes node:test resolve the parent
 * before its subtests and report every one of them as
 * "did not finish before its parent and was cancelled".
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { after, before, beforeEach, describe, it } from 'node:test';
import pg from 'pg';
import type { FastifyInstance } from 'fastify';

import { buildServer } from '../src/app.ts';
import { pool } from '../src/db/pool.ts';
import { migrate } from '../src/db/migrate.ts';
import { hashPassword } from '../src/lib/password.ts';
import { redis, clearPattern } from '../src/redis.ts';

const databaseUrl = process.env.DATABASE_URL ?? '';
const isTestDatabase = /_test(\?|$)/.test(databaseUrl);

const skip = isTestDatabase
  ? false
  : 'DATABASE_URL does not name a *_test database — refusing to run against real data.';

const EMAIL = 'test-admin@example.com';
const PASSWORD = 'correct-horse-battery-staple';

let app: FastifyInstance;

/** Pulls the cookie itself out of a Set-Cookie header, discarding its attributes. */
const cookieFrom = (header: string | string[] | undefined): string => {
  const raw = Array.isArray(header) ? header[0] ?? '' : String(header ?? '');
  return raw.split(';')[0] ?? '';
};

const setCookieHeader = (res: { headers: Record<string, unknown> }): string => {
  const value = res.headers['set-cookie'];
  return Array.isArray(value) ? String(value[0]) : String(value);
};

describe('admin auth', { skip }, () => {
  before(async () => {
    const client = new pg.Client({
      connectionString: process.env.MIGRATE_DATABASE_URL ?? databaseUrl,
    });
    await client.connect();
    await migrate(client);
    await client.end();

    await pool.query('DELETE FROM admin_sessions');

    // Upsert rather than delete-and-insert. An admin who has ever acted is
    // referenced by audit_log, and that reference has no ON DELETE clause on
    // purpose: the trail has to outlive the account, so accounts are disabled,
    // never removed. Deleting here fails with a foreign-key violation, which is
    // the schema working, not a test problem.
    await pool.query(
      `INSERT INTO admins (email, password_hash, display_name, role)
            VALUES ($1, $2, 'Test', 'owner')
       ON CONFLICT (email) DO UPDATE
            SET password_hash = EXCLUDED.password_hash, disabled_at = NULL`,
      [EMAIL, await hashPassword(PASSWORD)],
    );

    app = await buildServer();
    await app.ready();
  });

  after(async () => {
    await app?.close();
    await pool.end();
    await redis.quit();
  });

  /**
   * The lockout is 5 attempts per email per 15 minutes and this suite logs in
   * far more often than that. Clearing between tests keeps each independent;
   * the lockout is asserted explicitly below, where it is the subject rather
   * than an obstacle.
   */
  beforeEach(async () => {
    await clearPattern('login:*');
  });

  const login = (password: string, email = EMAIL) =>
    app.inject({ method: 'POST', url: '/admin/auth/login', payload: { email, password } });

  it('refuses a wrong password', async () => {
    const res = await login('not-the-password');
    assert.equal(res.statusCode, 401);
    assert.equal(res.json().error.code, 'unauthenticated');
  });

  it('gives an unknown address the identical refusal', async () => {
    const res = await login('whatever', 'nobody@example.com');
    assert.equal(res.statusCode, 401);
    // Identical to the wrong-password case: this endpoint must not be an oracle
    // for which addresses are administrators.
    assert.equal(res.json().error.code, 'unauthenticated');
  });

  it('issues a host-only, HttpOnly, SameSite=Lax cookie on success', async () => {
    const res = await login(PASSWORD);
    assert.equal(res.statusCode, 200);

    const header = setCookieHeader(res);
    assert.match(header, /^mnr_admin=/);
    assert.match(header, /HttpOnly/);
    assert.match(header, /SameSite=Lax/);
    // The important negative. A cookie scoped to .manourying.manouri.ovh would
    // ride along on every request to the public static site, which /privacy
    // says carries no cookies at all.
    assert.doesNotMatch(header, /Domain=/i);

    assert.equal(res.json().admin.email, EMAIL);
    assert.ok(res.json().csrfToken.length > 20);
  });

  it('stores the hash of the session token, never the token', async () => {
    const res = await login(PASSWORD);
    const token = cookieFrom(setCookieHeader(res)).split('=')[1]!;
    const digest = createHash('sha256').update(token, 'utf8').digest();

    const byHash = await pool.query(
      'SELECT 1 FROM admin_sessions WHERE token_sha256 = $1 AND revoked_at IS NULL',
      [digest],
    );
    assert.equal(byHash.rowCount, 1, 'the session should be findable by its token hash');

    // …and the raw token is in no column, so a database read does not hand over
    // live sessions.
    const raw = await pool.query(
      'SELECT 1 FROM admin_sessions WHERE token_sha256 = $1::bytea OR csrf_token = $2',
      [Buffer.from(token, 'utf8'), token],
    );
    assert.equal(raw.rowCount, 0, 'the raw token must not be stored anywhere');
  });

  it('rejects a mutation with no CSRF token', async () => {
    const res = await login(PASSWORD);
    const cookie = cookieFrom(setCookieHeader(res));

    const out = await app.inject({
      method: 'POST',
      url: '/admin/auth/logout',
      headers: { cookie },
    });
    assert.equal(out.statusCode, 403);
    assert.equal(out.json().error.code, 'csrf_invalid');
  });

  it('rejects a mutation with a wrong CSRF token', async () => {
    const res = await login(PASSWORD);
    const cookie = cookieFrom(setCookieHeader(res));

    const out = await app.inject({
      method: 'POST',
      url: '/admin/auth/logout',
      headers: { cookie, 'x-csrf-token': 'not-the-token' },
    });
    assert.equal(out.statusCode, 403);
    assert.equal(out.json().error.code, 'csrf_invalid');
  });

  it('rejects a mutation from a foreign same-site origin', async () => {
    const res = await login(PASSWORD);
    const cookie = cookieFrom(setCookieHeader(res));
    const csrf = res.json().csrfToken;

    // law.manouri.ovh shares the registrable domain manouri.ovh, so SameSite=Lax
    // would happily attach the cookie for it. This is the case CSRF exists for,
    // and the reason deleting it would be a real regression.
    const out = await app.inject({
      method: 'POST',
      url: '/admin/auth/logout',
      headers: { cookie, 'x-csrf-token': csrf, origin: 'https://law.manouri.ovh' },
    });
    assert.equal(out.statusCode, 403);
    assert.equal(out.json().error.code, 'bad_origin');
  });

  it('logs out, and the session is dead afterwards', async () => {
    const res = await login(PASSWORD);
    const cookie = cookieFrom(setCookieHeader(res));
    const csrf = res.json().csrfToken;

    const out = await app.inject({
      method: 'POST',
      url: '/admin/auth/logout',
      headers: { cookie, 'x-csrf-token': csrf, origin: 'http://127.0.0.1:5173' },
    });
    assert.equal(out.statusCode, 204);

    const me = await app.inject({ method: 'GET', url: '/admin/auth/me', headers: { cookie } });
    assert.equal(me.statusCode, 401);
  });

  it('locks out after repeated failures, and says when to come back', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await login('wrong-every-time');
      assert.equal(res.statusCode, 401, `attempt ${i + 1} should be a plain refusal`);
    }

    const locked = await login('wrong-every-time');
    assert.equal(locked.statusCode, 429);
    assert.equal(locked.json().error.code, 'too_many_attempts');
    assert.ok(Number(locked.headers['retry-after']) > 0, 'must say when to try again');

    // The lockout is on the attempt, not on the credential: even the correct
    // password is refused while the window is open.
    assert.equal((await login(PASSWORD)).statusCode, 429);
  });

  it('refuses a disabled admin with the same error as a wrong password', async () => {
    await pool.query('UPDATE admins SET disabled_at = now() WHERE email = $1', [EMAIL]);
    try {
      const res = await login(PASSWORD);
      assert.equal(res.statusCode, 401);
      assert.equal(res.json().error.code, 'unauthenticated');
    } finally {
      await pool.query('UPDATE admins SET disabled_at = NULL WHERE email = $1', [EMAIL]);
    }
  });
});
