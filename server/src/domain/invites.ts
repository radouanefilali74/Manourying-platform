/**
 * Invite codes: minting them, and the claim that spends exactly one.
 *
 * The app's own `src/domain/invites.ts` derives codes on-device from the seat
 * token, and says so in its own comments: "the mock's stand-in, not the real
 * mechanism… forgeable". This file is the real mechanism. Codes are minted from
 * a CSPRNG here, and a code is valid because a row exists, not because a
 * function reproduces it.
 */
import { randomInt } from 'node:crypto';
import type pg from 'pg';
import { pool, transaction } from '../db/pool.ts';
import { conflict } from '../lib/errors.ts';
import { mintToken } from '../lib/tokens.ts';
import { increment, incrementZone } from './counters.ts';

/**
 * The Crockford-style unambiguous alphabet from the app: no 0/O, no 1/I/L,
 * because these get read aloud and written on paper. 31 symbols.
 */
export const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** Three per seat, and they do not replenish. */
export const INVITES_PER_SEAT = 3;

/** What a person repeats out loud. 31^6 ≈ 887 million. */
export const SEAT_CODE_LENGTH = 6;

/**
 * Admin batches are longer, and the reason is worth stating: 31^6 stops being
 * safe long before it stops being collision-free. At ten million seats roughly
 * thirty million codes are live, so about one random guess in thirty hits a
 * valid one, and rate limiting becomes the only thing between an attacker and a
 * seat farm. Batch codes are pasted, never recited, so length costs nothing.
 */
export const BATCH_CODE_LENGTH = 10;

/**
 * randomInt is rejection-sampled and therefore unbiased. `randomBytes(1) % 31`
 * would be measurably skewed towards the first 8 symbols, because 256 is not a
 * multiple of 31 — a bias an attacker enumerating codes would happily use.
 */
export function mintCode(length = SEAT_CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) code += ALPHABET[randomInt(0, ALPHABET.length)];
  return code;
}

const UNIQUE_VIOLATION = '23505';

/** Inserts a code, retrying on the astronomically unlikely collision. */
async function insertCode(
  client: pg.PoolClient,
  columns: { seatId?: number; batchId?: number },
  length: number,
): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = mintCode(length);
    try {
      await client.query(
        'INSERT INTO invites (code, seat_id, batch_id) VALUES ($1, $2, $3)',
        [code, columns.seatId ?? null, columns.batchId ?? null],
      );
      return code;
    } catch (error) {
      if ((error as { code?: string }).code !== UNIQUE_VIOLATION) throw error;
    }
  }
  throw new Error('could not mint a unique invite code in five attempts');
}

export type ClaimResult = {
  seatId: number;
  token: string;
  invites: string[];
  parentSeatId: number | null;
};

/**
 * Spend one invite code and create the seat it buys.
 *
 * THE RACE. Two devices submitting the same code at the same instant must
 * resolve with exactly one winner, and this is where that is decided:
 *
 *   UPDATE invites SET claimed_at = now(), claimed_seat_id = $seat
 *    WHERE code = $code AND claimed_at IS NULL AND …
 *   RETURNING …
 *
 * Under READ COMMITTED — the default — the second transaction blocks on the row
 * lock the first took. When the first commits, Postgres re-evaluates the WHERE
 * clause against the NEW row version (EvalPlanQual). `claimed_at IS NULL` is now
 * false, so the second matches zero rows, gets nothing from RETURNING, and rolls
 * back — which also removes the speculative seat it inserted a moment earlier.
 *
 * No advisory lock, no SERIALIZABLE, no retry loop. One statement.
 *
 * The seat is inserted BEFORE the gate so that `invites_claim_coherent` can stay
 * a plain non-deferrable CHECK; the rollback is what makes that safe.
 */
export async function claimSeat(code: string, zoneOffset: number | null): Promise<ClaimResult> {
  const normalised = code.trim().toUpperCase();

  const result = await transaction(async (client) => {
    const seat = await client.query<{ id: number; token: string }>(
      `INSERT INTO seats (token, origin, zone_offset) VALUES ($1, 'invite', $2)
       RETURNING id, token`,
      [mintToken(), zoneOffset],
    );
    const seatId = seat.rows[0]!.id;

    const claimed = await client.query<{ id: number; seat_id: number | null }>(
      `UPDATE invites
          SET claimed_at = now(), claimed_seat_id = $2
        WHERE code = $1
          AND claimed_at IS NULL
          AND revoked_at IS NULL
          AND (expires_at IS NULL OR expires_at > now())
      RETURNING id, seat_id`,
      [normalised, seatId],
    );

    // Zero rows: spent, revoked, expired, or never existed. Deliberately one
    // message for all four — telling a stranger which of those is true tells
    // them whether a code they guessed exists.
    if (claimed.rowCount === 0) {
      throw conflict('invite_spent', 'That code has already been used, or is not a code.');
    }

    const parentSeatId = claimed.rows[0]!.seat_id;
    if (parentSeatId !== null) {
      await client.query('UPDATE seats SET parent_seat_id = $1 WHERE id = $2', [
        parentSeatId,
        seatId,
      ]);
    }

    const invites: string[] = [];
    for (let i = 0; i < INVITES_PER_SEAT; i++) {
      invites.push(await insertCode(client, { seatId }, SEAT_CODE_LENGTH));
    }

    return { seatId, token: seat.rows[0]!.token, invites, parentSeatId };
  });

  // Counters move only after the transaction commits. Incrementing inside it
  // would leave Redis ahead of reality whenever the transaction rolled back —
  // and the floor only rises, so that error would be permanent.
  await increment('seats.total');
  if (zoneOffset !== null) await incrementZone(zoneOffset);

  return result;
}

export type MintedBatch = { batchId: number; codes: string[] };

export async function mintBatch(
  label: string,
  count: number,
  expiresAt: string | null,
  adminId: number,
): Promise<MintedBatch> {
  return transaction(async (client) => {
    const batch = await client.query<{ id: number }>(
      `INSERT INTO invite_batches (label, count, expires_at, created_by)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [label, count, expiresAt, adminId],
    );
    const batchId = batch.rows[0]!.id;

    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(await insertCode(client, { batchId }, BATCH_CODE_LENGTH));
    }
    if (expiresAt) {
      await client.query('UPDATE invites SET expires_at = $2 WHERE batch_id = $1', [
        batchId,
        expiresAt,
      ]);
    }
    return { batchId, codes };
  });
}

/**
 * Revoke an UNSPENT code.
 *
 * Same conditional shape as the claim, for the same reason: a code claimed a
 * millisecond ago must not be retroactively revocable, or somebody's seat would
 * vanish under them. The CHECK constraint enforces the same thing at rest.
 */
export async function revokeInvite(code: string, adminId: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    `UPDATE invites SET revoked_at = now(), revoked_by = $2
      WHERE code = $1 AND claimed_at IS NULL AND revoked_at IS NULL`,
    [code, adminId],
  );
  return (rowCount ?? 0) > 0;
}
