/**
 * Seats & invites — mint batches, inspect lineage, revoke an unspent code.
 */
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/pool.ts';
import { audit } from '../../lib/audit.ts';
import { conflict, notFound } from '../../lib/errors.ts';
import { requireCsrf } from '../../plugins/csrf.ts';
import { requireAdmin } from '../../plugins/session.ts';
import { mintBatch, revokeInvite } from '../../domain/invites.ts';

/** Lineage can in principle be thousands deep; a runaway CTE is a slow query. */
const MAX_LINEAGE_DEPTH = 12;

export default async function seatRoutes(app: FastifyInstance) {
  app.get('/admin/seats', { preHandler: [requireAdmin] }, async (request) => {
    const { cursor, limit } = request.query as { cursor?: string; limit?: string };
    const take = Math.min(Number(limit) || 50, 200);

    const { rows } = await pool.query(
      `SELECT s.id, s.token, s.origin, s.zone_offset, s.claimed_at, s.revoked_at,
              s.parent_seat_id,
              (SELECT count(*) FROM seats c WHERE c.parent_seat_id = s.id) AS lineage,
              (SELECT count(*) FROM invites i
                WHERE i.seat_id = s.id AND i.claimed_at IS NULL AND i.revoked_at IS NULL)
                AS invites_left
         FROM seats s
        WHERE ($1::bigint IS NULL OR s.id < $1::bigint)
        ORDER BY s.id DESC
        LIMIT $2`,
      [cursor ? Number(cursor) : null, take],
    );

    return {
      seats: rows,
      nextCursor: rows.length === take ? String(rows[rows.length - 1]!.id) : null,
    };
  });

  app.get('/admin/seats/:id', { preHandler: [requireAdmin] }, async (request) => {
    const { id } = request.params as { id: string };

    const seat = await pool.query(
      `SELECT id, token, origin, zone_offset, claimed_at, revoked_at, parent_seat_id, note
         FROM seats WHERE id = $1`,
      [Number(id)],
    );
    if (!seat.rowCount) throw notFound('No such seat.');

    // The visible lineage, downwards. Depth-capped so one pathological chain
    // cannot turn this view into a table scan.
    const descendants = await pool.query(
      `WITH RECURSIVE tree AS (
         SELECT id, parent_seat_id, claimed_at, zone_offset, 1 AS depth
           FROM seats WHERE parent_seat_id = $1
         UNION ALL
         SELECT s.id, s.parent_seat_id, s.claimed_at, s.zone_offset, t.depth + 1
           FROM seats s JOIN tree t ON s.parent_seat_id = t.id
          WHERE t.depth < $2
       )
       SELECT id, parent_seat_id, claimed_at, zone_offset, depth FROM tree
        ORDER BY depth, id LIMIT 500`,
      [Number(id), MAX_LINEAGE_DEPTH],
    );

    const invites = await pool.query(
      `SELECT code, issued_at, expires_at, claimed_at, claimed_seat_id, revoked_at
         FROM invites WHERE seat_id = $1 ORDER BY issued_at`,
      [Number(id)],
    );

    return {
      seat: seat.rows[0],
      // Spent codes are returned too, never filtered — the app's own contract
      // says so, and an operator needs to see what a seat has already spent.
      invites: invites.rows,
      lineage: descendants.rows,
      lineageTruncated: descendants.rowCount === 500,
    };
  });

  app.get('/admin/invites', { preHandler: [requireAdmin] }, async (request) => {
    const { state, batch, seat } = request.query as Record<string, string | undefined>;

    const { rows } = await pool.query(
      `SELECT code, seat_id, batch_id, issued_at, expires_at,
              claimed_at, claimed_seat_id, revoked_at
         FROM invites
        WHERE ($1::text IS NULL OR
               ($1 = 'spendable' AND claimed_at IS NULL AND revoked_at IS NULL) OR
               ($1 = 'claimed'   AND claimed_at IS NOT NULL) OR
               ($1 = 'revoked'   AND revoked_at IS NOT NULL))
          AND ($2::bigint IS NULL OR batch_id = $2::bigint)
          AND ($3::bigint IS NULL OR seat_id  = $3::bigint)
        ORDER BY issued_at DESC LIMIT 500`,
      [state ?? null, batch ? Number(batch) : null, seat ? Number(seat) : null],
    );
    return { invites: rows };
  });

  app.get('/admin/invites/batches', { preHandler: [requireAdmin] }, async () => {
    const { rows } = await pool.query(
      `SELECT b.id, b.label, b.count, b.expires_at, b.created_at,
              count(i.id) FILTER (WHERE i.claimed_at IS NOT NULL) AS claimed,
              count(i.id) FILTER (WHERE i.revoked_at IS NOT NULL) AS revoked
         FROM invite_batches b LEFT JOIN invites i ON i.batch_id = b.id
        GROUP BY b.id ORDER BY b.created_at DESC`,
    );
    return { batches: rows };
  });

  app.post(
    '/admin/invites/batches',
    {
      preHandler: [requireAdmin, requireCsrf],
      schema: {
        body: {
          type: 'object',
          required: ['label', 'count'],
          additionalProperties: false,
          properties: {
            label: { type: 'string', minLength: 1, maxLength: 120 },
            count: { type: 'integer', minimum: 1, maximum: 5000 },
            expiresAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
      },
    },
    async (request) => {
      const { label, count, expiresAt } = request.body as {
        label: string;
        count: number;
        expiresAt?: string | null;
      };

      const { batchId, codes } = await mintBatch(
        label,
        count,
        expiresAt ?? null,
        request.admin!.id,
      );

      await audit(pool, {
        adminId: request.admin!.id,
        action: 'invites.mint',
        subjectType: 'batch',
        subjectId: batchId,
        // The codes themselves are NOT audited. The audit log is readable by
        // every admin and is meant to outlive them; a list of live invite codes
        // in it is a standing liability.
        detail: { label, count },
        ip: request.ip,
      });

      return { batchId, codes };
    },
  );

  app.post(
    '/admin/invites/:code/revoke',
    { preHandler: [requireAdmin, requireCsrf] },
    async (request) => {
      const { code } = request.params as { code: string };
      const revoked = await revokeInvite(code.toUpperCase(), request.admin!.id);

      // Spent invites do not return. Refusing here rather than silently doing
      // nothing is what tells an operator the code was claimed a moment ago.
      if (!revoked) {
        throw conflict(
          'invite_not_revocable',
          'That code has already been claimed, or was already revoked.',
        );
      }

      await audit(pool, {
        adminId: request.admin!.id,
        action: 'invites.revoke',
        subjectType: 'invite',
        subjectId: code.toUpperCase(),
        ip: request.ip,
      });

      return { revoked: true };
    },
  );

  app.get('/admin/audit', { preHandler: [requireAdmin] }, async (request) => {
    const { limit } = request.query as { limit?: string };
    const { rows } = await pool.query(
      `SELECT l.id, l.at, l.action, l.subject_type, l.subject_id, l.detail, a.email
         FROM audit_log l LEFT JOIN admins a ON a.id = l.admin_id
        ORDER BY l.id DESC LIMIT $1`,
      [Math.min(Number(limit) || 100, 500)],
    );
    return { entries: rows };
  });
}
