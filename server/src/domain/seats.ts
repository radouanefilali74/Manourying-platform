/**
 * The Seat view, and the bearer-token lookup behind it.
 *
 * Extracted from routes/public/seats.ts so that /cells and /echo can identify
 * a caller the same way rather than each growing their own copy — three
 * slightly different notions of "who is this" is how one of them ends up
 * accepting a revoked seat.
 */
import { pool } from '../db/pool.ts';
import { unauthenticated } from '../lib/errors.ts';

/** The app's `Seat` shape, assembled from the ledger. */
export async function seatView(seatId: number) {
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

/**
 * Resolve `Authorization: Bearer <seat token>` to a seat id, or throw 401.
 *
 * Revoked seats do not authenticate — `revoked_at IS NULL` is part of the
 * lookup, not a check afterwards, so there is no window in which a revoked
 * token still works.
 */
export async function seatFromBearer(authorization: string | undefined): Promise<number> {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) throw unauthenticated();
  const { rows } = await pool.query<{ id: number }>(
    'SELECT id FROM seats WHERE token = $1 AND revoked_at IS NULL',
    [token],
  );
  if (!rows[0]) throw unauthenticated();
  return rows[0].id;
}

/**
 * The same lookup, but absence is an answer rather than an error.
 *
 * `currentSeat()` on the app side returns `Seat | null`: a fresh install has
 * no token and must land on the Gate, not on an error screen. Routes that
 * answer that question use this; routes that act on behalf of a seat use
 * `seatFromBearer` and 401.
 */
export async function optionalSeatFromBearer(
  authorization: string | undefined,
): Promise<number | null> {
  try {
    return await seatFromBearer(authorization);
  } catch {
    return null;
  }
}
