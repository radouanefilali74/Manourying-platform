/**
 * The cached, approximate, monotonic counters.
 *
 * The app's own contract is explicit that these figures are "deliberately
 * approximate" and that nobody's count may appear to go backwards — a number
 * that ticks down is worse than a number that is slightly stale, because it
 * reads as people leaving.
 *
 * Two layers, with clearly divided jobs:
 *
 *   Redis is the increment sink and the read source. A claim does INCR and the
 *   next reader sees it. Fast, and never a COUNT(*) on a request path.
 *
 *   Postgres `counters` is the durable floor. A periodic snapshot writes Redis
 *   into it, and the counters_never_decrease() trigger means that floor can
 *   only rise. On boot we seed Redis back from the floor, taking the maximum —
 *   which is what makes a Redis flush survivable rather than a visible outage.
 */
import { pool, type Queryable } from '../db/pool.ts';
import { redis } from '../redis.ts';

export const COUNTER_KEYS = [
  'seats.total',
  'waitlist.total',
  'waitlist.next_position',
  'cells.visible',
] as const;

export type CounterKey = (typeof COUNTER_KEYS)[number];

export const isCounterKey = (value: string): value is CounterKey =>
  (COUNTER_KEYS as readonly string[]).includes(value);

const redisKey = (key: CounterKey) => `count:${key}`;

/**
 * The exact query behind each counter — the one that is too slow to run on a
 * request path, which is the entire reason the cache exists.
 *
 * Kept here rather than inline in the route so that "what does this number
 * actually mean" has one answer.
 */
const RECOUNT_SQL: Record<CounterKey, string> = {
  'seats.total': 'SELECT count(*)::bigint AS n FROM seats WHERE revoked_at IS NULL',
  'waitlist.total': 'SELECT count(*)::bigint AS n FROM waitlist WHERE released_at IS NULL',
  // The next position to hand out, not a population — so it is the high-water
  // mark, and it must never be recomputed as a count. Positions are permanent;
  // releasing somebody does not free their number for reuse.
  'waitlist.next_position': 'SELECT coalesce(max(position), 0)::bigint AS n FROM waitlist',
  'cells.visible': "SELECT count(*)::bigint AS n FROM cells WHERE status = 'visible'",
};

/**
 * Raise a Redis counter to at least `value`, atomically.
 *
 * A plain SET would let a slow boot overwrite increments that arrived while it
 * was reading the floor. GET-then-SET in JavaScript has the same race across
 * two processes. Lua runs on the server as one unit, so neither can happen.
 */
const RAISE_TO = `
  local current = tonumber(redis.call('GET', KEYS[1]) or '0')
  local floor = tonumber(ARGV[1])
  if current < floor then redis.call('SET', KEYS[1], floor) end
  return redis.call('GET', KEYS[1])
`;

async function raiseTo(key: CounterKey, value: number): Promise<number> {
  const result = await redis.eval(RAISE_TO, 1, redisKey(key), String(value));
  return Number(result);
}

/** Adds to a counter. Called after the transaction that made it true commits. */
export async function increment(key: CounterKey, by = 1): Promise<number> {
  return redis.incrby(redisKey(key), by);
}

/** Hands out the next waitlist position. Monotonic by construction, never COUNT(*). */
export async function nextWaitlistPosition(): Promise<number> {
  return redis.incr(redisKey('waitlist.next_position'));
}

export async function incrementZone(zoneOffset: number, by = 1): Promise<void> {
  await redis.hincrby('count:zones', String(zoneOffset), by);
}

export type CounterView = {
  key: CounterKey;
  /** What is actually served — the higher of the two layers. */
  value: number;
  cached: number | null;
  floor: number;
  refreshedAt: string | null;
  source: string;
  /**
   * cached − floor. This is the number an operator actually needs: it says how
   * far the fast path has drifted from the last durable snapshot.
   */
  drift: number;
};

export async function read(key: CounterKey): Promise<CounterView> {
  const [raw, row] = await Promise.all([
    redis.get(redisKey(key)),
    pool
      .query<{ value: number; refreshed_at: Date; source: string }>(
        'SELECT value, refreshed_at, source FROM counters WHERE key = $1',
        [key],
      )
      .then((r) => r.rows[0]),
  ]);

  const cached = raw === null ? null : Number(raw);
  const floor = row?.value ?? 0;

  return {
    key,
    value: Math.max(cached ?? 0, floor),
    cached,
    floor,
    refreshedAt: row?.refreshed_at.toISOString() ?? null,
    source: row?.source ?? 'incremental',
    drift: (cached ?? 0) - floor,
  };
}

export const readAll = (): Promise<CounterView[]> => Promise.all(COUNTER_KEYS.map(read));

/**
 * Copies Redis into the durable floor. Runs periodically and on shutdown.
 *
 * Guarded by a Redis lock so that a second process — during a deploy overlap,
 * say — cannot snapshot at the same time. The monotonic trigger would make a
 * double write harmless anyway; the lock keeps the audit trail honest.
 */
export async function snapshot(): Promise<number> {
  const lock = await redis.set('lock:counters', '1', 'PX', 30_000, 'NX');
  if (lock !== 'OK') return 0;

  try {
    let written = 0;
    for (const key of COUNTER_KEYS) {
      const raw = await redis.get(redisKey(key));
      if (raw === null) continue;
      await pool.query(
        `UPDATE counters
            SET value = GREATEST(value, $2::bigint), refreshed_at = now(), source = 'incremental'
          WHERE key = $1`,
        [key, Number(raw)],
      );
      written += 1;
    }
    return written;
  } finally {
    await redis.del('lock:counters');
  }
}

/**
 * Seeds Redis from the durable floor at boot, taking the maximum.
 *
 * Without this, a Redis restart would serve zero for every counter and the
 * published seat count would appear to collapse — precisely the failure the
 * app's contract forbids.
 */
export async function hydrate(): Promise<void> {
  const { rows } = await pool.query<{ key: string; value: number }>(
    'SELECT key, value FROM counters',
  );
  for (const row of rows) {
    if (isCounterKey(row.key)) await raiseTo(row.key, row.value);
  }
}

/**
 * Runs the expensive query on purpose, as an admin.
 *
 * This is the one place a COUNT(*) is allowed, and it is deliberately awkward
 * to reach: an authenticated, CSRF-protected, audited, rate-limited action
 * rather than anything on a request path.
 *
 * READ ONLY with a statement_timeout so that a recount on a large table cannot
 * hold a connection open indefinitely.
 */
export async function recount(
  key: CounterKey,
  adminId: number,
): Promise<CounterView & { exact: number; lowered: boolean }> {
  const client = await pool.connect();
  let exact: number;
  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '30s'");
    const { rows } = await client.query<{ n: number }>(RECOUNT_SQL[key]);
    exact = Number(rows[0]?.n ?? 0);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  // GREATEST, not assignment. If the true count is LOWER than what has been
  // published — revocations, a lost claim — the published number still does not
  // drop. The panel shows the delta prominently instead, and correcting it
  // downwards is a separate, deliberately awkward action.
  await pool.query(
    `UPDATE counters
        SET value = GREATEST(value, $2::bigint), refreshed_at = now(),
            source = 'recount', refreshed_by = $3
      WHERE key = $1`,
    [key, exact, adminId],
  );

  const floor = await pool
    .query<{ value: number }>('SELECT value FROM counters WHERE key = $1', [key])
    .then((r) => r.rows[0]?.value ?? 0);

  await raiseTo(key, floor);

  return { ...(await read(key)), exact, lowered: exact < floor };
}

/**
 * The escape hatch: lower a counter deliberately.
 *
 * Be honest about what the GUC guard is worth — it stops accidents, not a
 * compromised application, because this very role can set it. Its value is that
 * no ordinary code path can lower a published figure by mistake.
 */
export async function forceValue(
  key: CounterKey,
  value: number,
  adminId: number,
  db: Queryable = pool,
): Promise<void> {
  if (db === pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query("SET LOCAL manourying.allow_decrease = 'on'");
      await client.query(
        `UPDATE counters SET value = $2::bigint, refreshed_at = now(),
                source = 'manual', refreshed_by = $3 WHERE key = $1`,
        [key, value, adminId],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  // Redis holds the old, higher number; delete rather than raise so the next
  // read falls through to the floor we just set.
  await redis.del(redisKey(key));
}
