/**
 * The app-facing routes, end to end through the real Fastify stack.
 *
 * These go through `app.inject` rather than calling the domain functions
 * directly, because most of what can go wrong here is in the wiring: a schema
 * that rejects a legitimate body, a header that never reaches the handler, a
 * route registered behind the wrong switch. A domain-level test would pass
 * while the adapter still got a 400.
 *
 * Guarded exactly like the other suites — DATABASE_URL must name a *_test
 * database and REDIS_URL must be a test index, because these routes increment
 * the same live counters the published seat figure is read from.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { FastifyInstance } from 'fastify';
import pg from 'pg';

import { pool } from '../src/db/pool.ts';
import { migrate } from '../src/db/migrate.ts';
import { redis } from '../src/redis.ts';
import { mintToken } from '../src/lib/tokens.ts';
import { mintCode } from '../src/domain/invites.ts';

const databaseUrl = process.env.DATABASE_URL ?? '';
const isTestDatabase = /_test(\?|$)/.test(databaseUrl);
const onTestRedis = /\/(4|1[0-5])$/.test(process.env.REDIS_URL ?? '');
// PUBLIC_API is false in the real .env by design; .env.test turns it on, and
// it must be on before env.ts is imported — hence the file rather than a
// mutation in before().
const publicApiOn = process.env.PUBLIC_API === 'true';

const skip = !isTestDatabase
  ? 'DATABASE_URL does not name a *_test database — refusing to run against real data.'
  : !onTestRedis
    ? 'REDIS_URL points at the live counter database — set it to index 4 in server/.env.test.'
    : !publicApiOn
      ? 'PUBLIC_API is not on — set PUBLIC_API=true in server/.env.test.'
      : false;

let app: FastifyInstance;

/** A seat with a usable bearer token. */
async function seedSeat(zoneOffset: number | null = 1): Promise<string> {
  const token = mintToken();
  await pool.query(`INSERT INTO seats (token, origin, zone_offset) VALUES ($1, 'founder', $2)`, [
    token,
    zoneOffset,
  ]);
  return token;
}

describe('app-facing API', { skip }, () => {
  before(async () => {
    const client = new pg.Client({
      connectionString: process.env.MIGRATE_DATABASE_URL ?? databaseUrl,
    });
    await client.connect();
    await migrate(client);
    await client.end();

    const { buildServer } = await import('../src/app.ts');
    app = await buildServer();
    await app.ready();
  });

  after(async () => {
    await app?.close();
    await pool.end();
    redis.disconnect();
  });

  describe('GET /counts/seats', () => {
    it('returns the approximate figure in the documented shape', async () => {
      const res = await app.inject({ method: 'GET', url: '/counts/seats' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(typeof body.approximate, 'number');
      assert.ok(body.approximate >= 0);
    });

    it('is cacheable — this is the T-0 stampede route', async () => {
      const res = await app.inject({ method: 'GET', url: '/counts/seats' });
      assert.match(res.headers['cache-control'] as string, /max-age=\d+/);
    });
  });

  describe('GET /counts/zones', () => {
    it('returns an object keyed by UTC offset', async () => {
      const res = await app.inject({ method: 'GET', url: '/counts/zones' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(typeof body, 'object');
      for (const [offset, weight] of Object.entries(body)) {
        assert.ok(Number(offset) >= -11 && Number(offset) <= 12, `offset ${offset} in range`);
        assert.equal(typeof weight, 'number');
      }
    });
  });

  describe('POST /waitlist', () => {
    it('joins, and re-joining keeps the same position', async () => {
      const key = `dev-${mintToken()}`;
      const first = await app.inject({
        method: 'POST',
        url: '/waitlist',
        headers: { 'x-device-key': key },
        payload: { zoneOffset: 2 },
      });
      assert.equal(first.statusCode, 200);
      const a = first.json();
      assert.equal(typeof a.position, 'number');
      assert.equal(a.zoneOffset, 2);

      // A queue number that moves every time the screen opens is worse than
      // no number at all — the mock models the same rule.
      const second = await app.inject({
        method: 'POST',
        url: '/waitlist',
        headers: { 'x-device-key': key },
        payload: { zoneOffset: 5 },
      });
      const b = second.json();
      assert.equal(b.position, a.position, 'position must not move');
      assert.equal(b.zoneOffset, 5, 'but the zone may be corrected');
    });

    it('gives two different devices two different positions', async () => {
      const one = await app.inject({
        method: 'POST', url: '/waitlist',
        headers: { 'x-device-key': `dev-${mintToken()}` }, payload: { zoneOffset: 0 },
      });
      const two = await app.inject({
        method: 'POST', url: '/waitlist',
        headers: { 'x-device-key': `dev-${mintToken()}` }, payload: { zoneOffset: 0 },
      });
      assert.notEqual(one.json().position, two.json().position);
    });

    it('rejects a missing device key rather than inventing one', async () => {
      const res = await app.inject({
        method: 'POST', url: '/waitlist', payload: { zoneOffset: 0 },
      });
      assert.equal(res.statusCode, 400);
      assert.equal(res.json().error.code, 'invalid_request');
    });

    it('rejects a sub-hour offset, which the schema cannot represent', async () => {
      const res = await app.inject({
        method: 'POST', url: '/waitlist',
        headers: { 'x-device-key': `dev-${mintToken()}` },
        payload: { zoneOffset: 5.5 },
      });
      assert.equal(res.statusCode, 400);
    });
  });

  describe('GET /waitlist/me', () => {
    it('returns null for an unknown device, not 404', async () => {
      const res = await app.inject({
        method: 'GET', url: '/waitlist/me',
        headers: { 'x-device-key': `dev-${mintToken()}` },
      });
      assert.equal(res.statusCode, 200);
      assert.equal(res.json(), null);
    });

    it('returns the entry once joined', async () => {
      const key = `dev-${mintToken()}`;
      await app.inject({
        method: 'POST', url: '/waitlist',
        headers: { 'x-device-key': key }, payload: { zoneOffset: -3 },
      });
      const res = await app.inject({
        method: 'GET', url: '/waitlist/me', headers: { 'x-device-key': key },
      });
      const body = res.json();
      assert.equal(body.zoneOffset, -3);
      assert.equal(typeof body.joinedAt, 'string');
    });
  });

  describe('cells', () => {
    it('requires a seat to open one', async () => {
      const res = await app.inject({
        method: 'POST', url: '/cells',
        payload: { name: 'A square', kind: 'Open square', zoneOffset: 1 },
      });
      assert.equal(res.statusCode, 401);
      assert.equal(res.json().error.code, 'unauthenticated');
    });

    it('opens one and lists it back in the same zone', async () => {
      const token = await seedSeat();
      const name = `Test cell ${mintToken().slice(0, 8)}`;
      const created = await app.inject({
        method: 'POST', url: '/cells',
        headers: { authorization: `Bearer ${token}` },
        payload: { name, kind: 'Waterfront', zoneOffset: 7 },
      });
      assert.equal(created.statusCode, 200);
      const cell = created.json();
      assert.equal(cell.name, name);
      assert.equal(cell.pledged, 1);
      // No fix supplied, so distance is the mock's em dash, never null.
      assert.equal(cell.distance, '—');

      const listed = await app.inject({ method: 'GET', url: '/cells?zone=7' });
      assert.equal(listed.statusCode, 200);
      assert.ok(listed.json().some((c: { id: string }) => c.id === cell.id));
    });

    it('computes a readable distance when given a fix', async () => {
      const token = await seedSeat();
      await app.inject({
        method: 'POST', url: '/cells',
        headers: { authorization: `Bearer ${token}` },
        payload: { name: 'Near point', kind: 'Square', zoneOffset: 9, lat: 48.8584, lon: 2.2945 },
      });
      // ~1.3 km away from the cell above.
      const res = await app.inject({
        method: 'GET', url: '/cells?zone=9&lat=48.8606&lon=2.3376',
      });
      const cell = res.json().find((c: { name: string }) => c.name === 'Near point');
      assert.ok(cell, 'the cell is listed');
      assert.match(cell.distance, /^\d+(\.\d)? (m|km)$/, `got ${cell.distance}`);
    });

    it('rejects a name the database would reject anyway', async () => {
      const token = await seedSeat();
      const res = await app.inject({
        method: 'POST', url: '/cells',
        headers: { authorization: `Bearer ${token}` },
        payload: { name: 'x', kind: 'Square', zoneOffset: 1 },
      });
      assert.equal(res.statusCode, 400, 'caught at the schema, not as a 500 from the CHECK');
    });

    it('never lists a hidden or removed cell', async () => {
      const token = await seedSeat();
      const created = await app.inject({
        method: 'POST', url: '/cells',
        headers: { authorization: `Bearer ${token}` },
        payload: { name: 'To be hidden', kind: 'Square', zoneOffset: 11 },
      });
      const id = created.json().id;
      await pool.query(`UPDATE cells SET status = 'removed' WHERE public_id = $1`, [id]);

      const listed = await app.inject({ method: 'GET', url: '/cells?zone=11' });
      assert.ok(!listed.json().some((c: { id: string }) => c.id === id));
    });
  });

  describe('GET /echo/latest', () => {
    it('returns an empty summary rather than 404 when nothing is published', async () => {
      const res = await app.inject({ method: 'GET', url: '/echo/latest' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(typeof body.cycleLabel, 'string');
      assert.equal(body.record, null);
      assert.ok(Array.isArray(body.captures));
    });

    it('works without a seat — the aggregate belongs to everybody', async () => {
      const res = await app.inject({ method: 'GET', url: '/echo/latest' });
      assert.equal(res.statusCode, 200);
    });

    it('only ever exposes published captures', async () => {
      const cycle = await pool.query<{ id: number }>(
        `INSERT INTO echo_cycles (label, moment_utc, voices, zones_reached, spread_seconds, published_at)
         VALUES ($1, now(), 42, 3, 0.9, now()) RETURNING id`,
        [`Test cycle ${mintToken().slice(0, 8)}`],
      );
      const cycleId = cycle.rows[0]!.id;
      await pool.query(
        `INSERT INTO echo_submissions (cycle_id, place, local_time, note, state)
         VALUES ($1, 'Nowhere', '00:00 local', 'unreviewed', 'submitted')`,
        [cycleId],
      );

      const res = await app.inject({ method: 'GET', url: '/echo/latest' });
      const body = res.json();
      assert.ok(!body.captures.some((c: { note: string }) => c.note === 'unreviewed'));
    });
  });

  describe('seat routes still behave', () => {
    it('claims a seat and returns the documented shape', async () => {
      const parent = await pool.query<{ id: number }>(
        `INSERT INTO seats (token, origin) VALUES ($1, 'founder') RETURNING id`,
        [mintToken()],
      );
      const code = mintCode();
      await pool.query('INSERT INTO invites (code, seat_id) VALUES ($1, $2)', [
        code,
        parent.rows[0]!.id,
      ]);

      const res = await app.inject({ method: 'POST', url: '/seats', payload: { code } });
      assert.equal(res.statusCode, 200);
      const seat = res.json();
      assert.equal(typeof seat.token, 'string');
      assert.equal(seat.invitesLeft, 3);
      assert.equal(seat.lineage, 0);
    });

    it('401s an unknown bearer token on /seats/me', async () => {
      const res = await app.inject({
        method: 'GET', url: '/seats/me', headers: { authorization: 'Bearer nope' },
      });
      assert.equal(res.statusCode, 401);
    });
  });
});
