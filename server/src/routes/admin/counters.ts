/**
 * Counters — inspect the cached figures, and force a refresh.
 *
 * The point of this view is the DRIFT, not the value. An operator can read the
 * published seat count anywhere; what they cannot get anywhere else is how far
 * the fast path has wandered from the last durable snapshot, and whether a
 * recount would move it.
 */
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/pool.ts';
import { audit } from '../../lib/audit.ts';
import { badRequest, notFound, tooMany } from '../../lib/errors.ts';
import { bump } from '../../redis.ts';
import { requireCsrf } from '../../plugins/csrf.ts';
import { requireAdmin } from '../../plugins/session.ts';
import { isCounterKey, readAll, recount, snapshot } from '../../domain/counters.ts';

/** A recount is the slow query this cache exists to avoid. Once per 5 min per key. */
const RECOUNT_WINDOW_SECONDS = 300;
const RECOUNT_MAX = 1;

export default async function counterRoutes(app: FastifyInstance) {
  app.get('/admin/counters', { preHandler: [requireAdmin] }, async () => ({
    counters: await readAll(),
  }));

  app.post(
    '/admin/counters/:key/refresh',
    { preHandler: [requireAdmin, requireCsrf] },
    async (request, reply) => {
      const { key } = request.params as { key: string };
      if (!isCounterKey(key)) throw notFound(`No counter called "${key}".`);

      const limit = await bump(`recount:${key}`, RECOUNT_WINDOW_SECONDS);
      if (limit.count > RECOUNT_MAX) {
        reply.header('Retry-After', String(limit.resetIn));
        throw tooMany(
          'That counter was recounted recently. This is the slow query the cache exists to avoid.',
          limit.resetIn,
        );
      }

      const result = await recount(key, request.admin!.id);

      await audit(pool, {
        adminId: request.admin!.id,
        action: 'counters.recount',
        subjectType: 'counter',
        subjectId: key,
        detail: { exact: result.exact, published: result.value, lowered: result.lowered },
        ip: request.ip,
      });

      return result;
    },
  );

  /**
   * Writes Redis into the durable floor without recounting anything. Cheap, and
   * the thing to reach for before a deliberate Redis restart.
   */
  app.post(
    '/admin/counters/snapshot',
    { preHandler: [requireAdmin, requireCsrf] },
    async (request) => {
      const written = await snapshot();
      await audit(pool, {
        adminId: request.admin!.id,
        action: 'counters.snapshot',
        subjectType: 'counter',
        detail: { written },
        ip: request.ip,
      });
      return { written };
    },
  );

  /**
   * Lower a counter on purpose. Requires naming the key again in the body — the
   * awkwardness is the feature, because this is the only action in the panel
   * that can make a published figure go backwards.
   */
  app.post(
    '/admin/counters/:key/force',
    {
      preHandler: [requireAdmin, requireCsrf],
      schema: {
        body: {
          type: 'object',
          required: ['value', 'confirm'],
          additionalProperties: false,
          properties: {
            value: { type: 'integer', minimum: 0 },
            confirm: { type: 'string' },
          },
        },
      },
    },
    async (request) => {
      const { key } = request.params as { key: string };
      const { value, confirm } = request.body as { value: number; confirm: string };

      if (!isCounterKey(key)) throw notFound(`No counter called "${key}".`);
      if (confirm !== key) {
        throw badRequest(`Type the counter key "${key}" to confirm lowering it.`);
      }
      if (request.admin!.role !== 'owner') {
        throw badRequest('Only an owner can force a counter downwards.');
      }

      const { forceValue, read } = await import('../../domain/counters.ts');
      const before = await read(key);
      await forceValue(key, value, request.admin!.id);

      await audit(pool, {
        adminId: request.admin!.id,
        action: 'counters.force',
        subjectType: 'counter',
        subjectId: key,
        detail: { from: before.value, to: value },
        ip: request.ip,
      });

      return read(key);
    },
  );
}
