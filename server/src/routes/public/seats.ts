/**
 * The app-facing seat routes.
 *
 * These are implemented for real — the admin invite view is meaningless if
 * nothing can spend a code, and the claim race cannot be tested against a stub.
 * But reaching them requires TWO deliberate switches: PUBLIC_API=true here, and
 * nginx actually proxying these paths, which it does not. The mobile app is
 * still on MockService, so anything reachable here today would be abuse surface
 * and nothing else.
 *
 * Shapes match `ManouryingService` in the app's src/services/types.ts exactly.
 * The error copy matches the mock's voice, because the Gate displays it as-is.
 */
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/pool.ts';
import { badRequest, unauthenticated } from '../../lib/errors.ts';
import { claimSeat, ALPHABET } from '../../domain/invites.ts';

const CODE_PATTERN = new RegExp(`^[${ALPHABET}]{6,12}$`);

/** The app's Seat shape, assembled from the ledger. */
async function seatView(seatId: number) {
  const { rows } = await pool.query(
    `SELECT s.token, s.claimed_at,
            (SELECT count(*) FROM invites i
              WHERE i.seat_id = s.id AND i.claimed_at IS NULL AND i.revoked_at IS NULL)
              AS invites_left,
            (SELECT count(*) FROM seats c WHERE c.parent_seat_id = s.id) AS lineage
       FROM seats s WHERE s.id = $1`,
    [seatId],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    token: row.token,
    invitesLeft: Number(row.invites_left),
    lineage: Number(row.lineage),
    claimedAt: new Date(row.claimed_at).toISOString(),
  };
}

async function seatFromBearer(authorization: string | undefined) {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) throw unauthenticated();
  const { rows } = await pool.query<{ id: number }>(
    'SELECT id FROM seats WHERE token = $1 AND revoked_at IS NULL',
    [token],
  );
  if (!rows[0]) throw unauthenticated();
  return rows[0].id;
}

export default async function publicSeatRoutes(app: FastifyInstance) {
  app.post(
    '/seats',
    {
      schema: {
        body: {
          type: 'object',
          required: ['code'],
          additionalProperties: false,
          properties: {
            code: { type: 'string', minLength: 6, maxLength: 12 },
            zoneOffset: { type: ['integer', 'null'], minimum: -11, maximum: 12 },
          },
        },
      },
    },
    async (request) => {
      const { code, zoneOffset } = request.body as { code: string; zoneOffset?: number | null };

      // The mock's own copy, verbatim — the Gate shows this to a human as-is.
      if (!CODE_PATTERN.test(code.trim().toUpperCase())) {
        throw badRequest('Codes are six characters. Ask whoever sent you here.');
      }

      const result = await claimSeat(code, zoneOffset ?? null);
      return seatView(result.seatId);
    },
  );

  app.get('/seats/me', async (request) => {
    const seatId = await seatFromBearer(request.headers.authorization);
    return seatView(seatId);
  });

  app.get('/seats/me/invites', async (request) => {
    const seatId = await seatFromBearer(request.headers.authorization);
    const { rows } = await pool.query(
      `SELECT code, claimed_at FROM invites
        WHERE seat_id = $1 AND revoked_at IS NULL ORDER BY issued_at`,
      [seatId],
    );
    // Spent invites are returned too, never filtered — the app's contract is
    // explicit about that, and the screen shows them struck through.
    return rows.map((r) => ({
      code: r.code,
      claimed: r.claimed_at !== null,
      claimedAt: r.claimed_at ? new Date(r.claimed_at).toISOString() : null,
    }));
  });
}
