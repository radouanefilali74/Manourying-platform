/**
 * Redis — the counter sink, the rate-limit store, and the login lockout.
 *
 * This instance is shared with the other tenant on this box, so everything here
 * lives in database index 3 (set in REDIS_URL) behind an `mnr:` key prefix.
 * Two independent namespaces, because one of them is not ours.
 */
// Named import, not default: ioredis is CJS, and under NodeNext its default
// resolves to the module namespace rather than the class.
import { Redis } from 'ioredis';
import { env } from './env.ts';

export const KEY_PREFIX = 'mnr:';

export const redis = new Redis(env.redisUrl, {
  keyPrefix: KEY_PREFIX,
  // Bounded, not unbounded: a command retries three times and then fails, so a
  // request that needs Redis errors while the operator is watching rather than
  // hanging. The offline queue stays ON so that commands issued during the
  // brief initial connect are held rather than thrown away — with lazyConnect
  // and no queue, the very first /healthz reports Redis down purely because
  // nothing had connected yet.
  maxRetriesPerRequest: 3,
});

// Connection errors are reported by the callers that hit them. Without a
// listener, ioredis logs every reconnect attempt as an unhandled error event
// and drowns the journal.
redis.on('error', () => {});

export async function redisHealthy(): Promise<'up' | 'down'> {
  try {
    await redis.ping();
    return 'up';
  } catch {
    return 'down';
  }
}

/**
 * A fixed-window counter, used for the login lockout.
 *
 * Returns the count after incrementing and the seconds until the window
 * resets. Fixed rather than sliding on purpose: the failure mode of a fixed
 * window is that an attacker gets 2× the limit across a boundary, which for
 * "5 password attempts per 15 minutes" is not a meaningful weakening, and the
 * implementation is two commands instead of a sorted set per identity.
 */
export async function bump(
  key: string,
  windowSeconds: number,
): Promise<{ count: number; resetIn: number }> {
  const results = await redis.multi().incr(key).expire(key, windowSeconds, 'NX').ttl(key).exec();

  if (!results) throw new Error('redis transaction returned no result');

  const count = Number(results[0]?.[1] ?? 0);
  const ttl = Number(results[2]?.[1] ?? windowSeconds);
  return { count, resetIn: ttl > 0 ? ttl : windowSeconds };
}

export async function clearKey(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Deletes every key matching an unprefixed pattern, e.g. `login:*`.
 *
 * This exists because ioredis's `keyPrefix` is asymmetric in a way that is very
 * easy to get wrong: it IS applied to key arguments (`del`, `get`, `incr`) but
 * is NOT applied to the pattern argument of `KEYS`, and the names KEYS returns
 * come back already prefixed. So a naive `del(...await keys('login:*'))`
 * matches nothing and then deletes `mnr:mnr:login:…`. Both halves are handled
 * here once, so no caller has to remember.
 *
 * KEYS scans the whole keyspace, so this is for tests and maintenance, not for
 * a request path.
 */
export async function clearPattern(pattern: string): Promise<number> {
  const found = await redis.keys(`${KEY_PREFIX}${pattern}`);
  if (!found.length) return 0;
  return redis.del(...found.map((key) => key.slice(KEY_PREFIX.length)));
}
