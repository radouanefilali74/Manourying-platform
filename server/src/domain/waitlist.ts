/**
 * The waitlist — joining without a code.
 *
 * IDENTITY. `waitlist.device_sha256` is NOT NULL UNIQUE, which is the whole
 * anti-stuffing mechanism: one queue position per device, enforced by the
 * database rather than by trusting the client to ask once. But the app's
 * `joinWaitlist({ zoneOffset })` takes no device argument, so the adapter has
 * to supply one out of band — a random secret minted once, kept in secure
 * storage, sent as `X-Device-Key`.
 *
 * Only the SHA-256 is stored. The server never holds the secret, so the table
 * cannot be turned into a device registry, and the column is not reversible
 * into anything about a person. That is the same property the seat token has.
 *
 * POSITION. Never a COUNT(*) — `nextWaitlistPosition()` is a Redis INCR
 * against the monotonic `waitlist.next_position` counter. Positions are
 * permanent and are not reused when somebody is released, so a gap in the
 * sequence is expected rather than a bug.
 */
import { createHash } from 'node:crypto';
import { pool } from '../db/pool.ts';
import { conflict } from '../lib/errors.ts';
import { increment, nextWaitlistPosition } from './counters.ts';

export type WaitlistEntryView = {
  position: number;
  zoneOffset: number;
  joinedAt: string;
};

export const deviceHash = (key: string): Buffer =>
  createHash('sha256').update(key, 'utf8').digest();

type Row = {
  position: string;
  zone_offset: number;
  joined_at: Date;
  released_at: Date | null;
  inserted?: boolean;
};

const view = (row: Row): WaitlistEntryView => ({
  position: Number(row.position),
  zoneOffset: row.zone_offset,
  joinedAt: new Date(row.joined_at).toISOString(),
});

/** The entry held by this device, or null. A released entry is not "waiting". */
export async function currentWaitlist(key: string): Promise<WaitlistEntryView | null> {
  const { rows } = await pool.query<Row>(
    `SELECT position, zone_offset, joined_at, released_at
       FROM waitlist WHERE device_sha256 = $1`,
    [deviceHash(key)],
  );
  const row = rows[0];
  if (!row || row.released_at !== null) return null;
  return view(row);
}

/**
 * Join, or update where an existing entry says it will be standing.
 *
 * Re-joining never moves somebody's position — the mock models the same rule,
 * and for the same reason: a queue number that changes every time the screen
 * opens is worse than no number at all.
 *
 * The INCR happens before the INSERT, so a losing race burns a position
 * without using it. That is deliberate: the alternative is holding a lock
 * across the round trip, and the sequence is explicitly allowed to have gaps.
 */
export async function joinWaitlist(key: string, zoneOffset: number): Promise<WaitlistEntryView> {
  const hash = deviceHash(key);

  const existing = await pool.query<Row>(
    `SELECT position, zone_offset, joined_at, released_at
       FROM waitlist WHERE device_sha256 = $1`,
    [hash],
  );

  if (existing.rows[0]) {
    const row = existing.rows[0];
    if (row.released_at !== null) {
      // They are already through the queue and holding an invite. Re-queueing
      // would hand them a second position they do not need and cannot use.
      throw conflict(
        'waitlist_released',
        'You already have an invite waiting. Enter the code you were sent.',
      );
    }
    const updated = await pool.query<Row>(
      `UPDATE waitlist SET zone_offset = $2 WHERE device_sha256 = $1
        RETURNING position, zone_offset, joined_at, released_at`,
      [hash, zoneOffset],
    );
    return view(updated.rows[0]!);
  }

  const position = await nextWaitlistPosition();

  // ON CONFLICT closes the window between the SELECT above and this INSERT.
  // `xmax = 0` is true only for a genuine insert, which is how the counter
  // avoids being incremented for what turned out to be an update.
  const { rows } = await pool.query<Row>(
    `INSERT INTO waitlist (device_sha256, position, zone_offset)
     VALUES ($1, $2, $3)
     ON CONFLICT (device_sha256) DO UPDATE SET zone_offset = EXCLUDED.zone_offset
     RETURNING position, zone_offset, joined_at, released_at, (xmax = 0) AS inserted`,
    [hash, position, zoneOffset],
  );

  const row = rows[0]!;
  if (row.inserted) await increment('waitlist.total');
  return view(row);
}
