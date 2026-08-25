/**
 * The claim race — the most important test in this repo.
 *
 * The app's own service contract (src/services/remote.ts) names this as
 * non-negotiable: "two simultaneous claims of one code" must be "a race exactly
 * one wins". Everything about the invite system is decoration if this is wrong,
 * because the failure is silent — two people quietly hold seats bought with one
 * code, and nobody finds out until the lineage does not add up.
 *
 * Guarded the same way auth.test.ts is: DATABASE_URL must name a *_test
 * database. See that file's header for why this is not part of `npm run verify`.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import pg from 'pg';

import { pool } from '../src/db/pool.ts';
import { migrate } from '../src/db/migrate.ts';
import { redis } from '../src/redis.ts';
import { claimSeat, mintCode, INVITES_PER_SEAT } from '../src/domain/invites.ts';
import { mintToken } from '../src/lib/tokens.ts';

const databaseUrl = process.env.DATABASE_URL ?? '';
const isTestDatabase = /_test(\?|$)/.test(databaseUrl);
/**
 * Two guards, not one. Postgres isolation is not enough: claimSeat increments
 * counters in REDIS, which is keyed by URL and not by database — so a test run
 * pointed at the live Redis index silently inflates the published seat count.
 * That happened once; forty phantom seats had to be corrected by hand.
 */
const onTestRedis = /\/(4|1[0-5])$/.test(process.env.REDIS_URL ?? '');

const skip = !isTestDatabase
  ? 'DATABASE_URL does not name a *_test database — refusing to run against real data.'
  : !onTestRedis
    ? 'REDIS_URL points at the live counter database — set it to index 4 in server/.env.test.'
    : false;

/** Seeds one founder seat holding one spendable code. */
async function seedCode(): Promise<{ code: string; parentSeatId: number }> {
  const seat = await pool.query<{ id: number }>(
    `INSERT INTO seats (token, origin) VALUES ($1, 'founder') RETURNING id`,
    [mintToken()],
  );
  const parentSeatId = seat.rows[0]!.id;
  const code = mintCode();
  await pool.query('INSERT INTO invites (code, seat_id) VALUES ($1, $2)', [code, parentSeatId]);
  return { code, parentSeatId };
}

describe('the claim race', { skip }, () => {
  before(async () => {
    const client = new pg.Client({
      connectionString: process.env.MIGRATE_DATABASE_URL ?? databaseUrl,
    });
    await client.connect();
    await migrate(client);
    await client.end();
  });

  after(async () => {
    await pool.end();
    await redis.quit();
  });

  it('lets exactly one of twenty simultaneous claims win', async () => {
    const { code, parentSeatId } = await seedCode();

    // Fired together, not in sequence: Promise.allSettled starts all twenty
    // before any resolves, so they contend for the same row lock for real.
    const outcomes = await Promise.allSettled(
      Array.from({ length: 20 }, () => claimSeat(code, 1)),
    );

    const won = outcomes.filter((o) => o.status === 'fulfilled');
    const lost = outcomes.filter((o) => o.status === 'rejected');

    assert.equal(won.length, 1, `exactly one claim should win, got ${won.length}`);
    assert.equal(lost.length, 19);

    for (const failure of lost) {
      assert.equal(
        (failure as PromiseRejectedResult).reason.code,
        'invite_spent',
        'losers must fail with invite_spent, not a deadlock or a constraint error',
      );
    }

    // The ledger agrees: one claim recorded…
    const invite = await pool.query<{ claimed_seat_id: number | null }>(
      'SELECT claimed_seat_id FROM invites WHERE code = $1',
      [code],
    );
    assert.ok(invite.rows[0]!.claimed_seat_id, 'the invite should be marked claimed');

    // …and exactly one seat descends from the issuer. This is the assertion that
    // would catch a silent double-claim: the nineteen losers each INSERTed a
    // speculative seat, and every one of those rollbacks must have taken effect.
    const children = await pool.query<{ n: string }>(
      'SELECT count(*)::text AS n FROM seats WHERE parent_seat_id = $1',
      [parentSeatId],
    );
    assert.equal(children.rows[0]!.n, '1', 'exactly one seat may descend from that invite');
  });

  it('leaves no orphan seats behind when claims lose', async () => {
    const before = await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM seats');
    const { code } = await seedCode();

    await Promise.allSettled(Array.from({ length: 10 }, () => claimSeat(code, 1)));

    const after = await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM seats');
    // One founder seat from seedCode, plus exactly one winner. The nine losing
    // transactions must leave nothing at all.
    assert.equal(Number(after.rows[0]!.n) - Number(before.rows[0]!.n), 2);
  });

  it('issues the winner three fresh codes, and no more', async () => {
    const { code } = await seedCode();
    const result = await claimSeat(code, 1);

    assert.equal(result.invites.length, INVITES_PER_SEAT);
    assert.equal(new Set(result.invites).size, INVITES_PER_SEAT, 'codes must be distinct');

    const stored = await pool.query<{ n: string }>(
      'SELECT count(*)::text AS n FROM invites WHERE seat_id = $1',
      [result.seatId],
    );
    assert.equal(stored.rows[0]!.n, String(INVITES_PER_SEAT));
  });

  it('refuses a revoked code, and a claimed code cannot be revoked', async () => {
    const { code } = await seedCode();
    await pool.query('UPDATE invites SET revoked_at = now() WHERE code = $1', [code]);

    await assert.rejects(claimSeat(code, 1), (error: { code?: string }) => {
      assert.equal(error.code, 'invite_spent');
      return true;
    });

    // The other direction: revoking after a claim must fail, so a seat cannot be
    // taken away retroactively.
    const { code: second } = await seedCode();
    await claimSeat(second, 1);
    const { rowCount } = await pool.query(
      `UPDATE invites SET revoked_at = now()
        WHERE code = $1 AND claimed_at IS NULL AND revoked_at IS NULL`,
      [second],
    );
    assert.equal(rowCount, 0, 'a claimed code must not be revocable');
  });

  it('mints codes from the unambiguous alphabet only', () => {
    for (let i = 0; i < 200; i++) {
      // No 0/O and no 1/I/L: these get read aloud and written down.
      assert.match(mintCode(), /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
    }
  });
});
