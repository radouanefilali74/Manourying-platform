/**
 * The published figures.
 *
 * Both routes are the reason the counter cache in domain/counters.ts exists:
 * at T−0 every client on earth reads these at once, and an exact COUNT(*) is a
 * write-contended read that fails at precisely the moment it must not. Neither
 * route touches a count query — they read the cached value, which is
 * approximate and monotonic by construction.
 *
 * Both are unauthenticated and safe to cache at the edge. The Cache-Control
 * below is what a CDN in front of this would obey; nginx does not currently
 * add one for these paths, so it is set here at the origin.
 */
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/pool.ts';
import { redis } from '../../redis.ts';
import { read } from '../../domain/counters.ts';

/** Long enough to absorb the T−0 stampede, short enough to still feel alive. */
const COUNT_TTL_SECONDS = 60;

export default async function countRoutes(app: FastifyInstance) {
  /** GET /counts/seats → { approximate } — the shape remote.ts documents. */
  app.get('/counts/seats', async (_request, reply) => {
    const counter = await read('seats.total');
    reply.header('Cache-Control', `public, max-age=${COUNT_TTL_SECONDS}`);
    return { approximate: counter.value };
  });

  /**
   * GET /counts/zones → Record<offset, weight>
   *
   * `weight` is a RELATIVE participation figure, matching what the app's
   * domain/zones.ts means by the word — raw per-zone seat counts, not a
   * normalised 0..1 fraction. The Field sizes its bands from the ratios, so
   * handing over the raw numbers keeps that decision on the client where the
   * band geometry already lives.
   *
   * Read from the Redis hash the claim path increments, falling back to the
   * durable zone_counts table per zone. Taking the max of the two mirrors what
   * the counters do: a Redis flush must not make a zone appear to empty.
   */
  app.get('/counts/zones', async (_request, reply) => {
    const [live, durable] = await Promise.all([
      redis.hgetall('count:zones'),
      pool.query<{ zone_offset: number; seats: string }>(
        'SELECT zone_offset, seats FROM zone_counts',
      ),
    ]);

    const weights: Record<number, number> = {};
    for (const row of durable.rows) {
      weights[row.zone_offset] = Number(row.seats);
    }
    for (const [offset, value] of Object.entries(live)) {
      const zone = Number(offset);
      if (!Number.isInteger(zone) || zone < -11 || zone > 12) continue;
      weights[zone] = Math.max(weights[zone] ?? 0, Number(value) || 0);
    }

    reply.header('Cache-Control', `public, max-age=${COUNT_TTL_SECONDS}`);
    return weights;
  });
}
