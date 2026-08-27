/**
 * The Echo — the previous cycle's aggregate, plus this seat's own record card.
 *
 * Two rules the schema enforces and this file must not work around:
 *
 *  - Only `state = 'published'` submissions are ever shown to anybody. The
 *    `echo_publish_requires_clearance_and_consent` CHECK means a published row
 *    has been cleared by a human AND has explicit granted consent, so
 *    filtering on that one column is sufficient — there is no second condition
 *    to remember here.
 *
 *  - `uploaded` is always false today. `echo_audio_deferred` is a CHECK that
 *    forces `audio_ref IS NULL`, so audio capture is deliberately not built
 *    yet. Deriving the field from the column rather than hardcoding `false`
 *    means it starts telling the truth the day that constraint is lifted,
 *    without this file changing.
 */
import { pool } from '../db/pool.ts';

export type EchoRecordView = {
  deviationMs: number;
  timestamp: string;
  location: string;
  zoneLabel: string;
  cellName: string | null;
  capturedSeconds: number;
  uploaded: boolean;
};

export type EchoSummaryView = {
  cycleLabel: string;
  voices: number;
  zonesReached: number;
  zonesTotal: number;
  spreadSeconds: number;
  record: EchoRecordView | null;
  captures: { place: string; localTime: string; note: string }[];
};

/** "UTC+1", "UTC−5", "UTC" — matching the app's own zone labelling. */
export function zoneLabel(offset: number | null): string {
  if (offset === null) return 'UTC';
  if (offset === 0) return 'UTC';
  return offset > 0 ? `UTC+${offset}` : `UTC−${Math.abs(offset)}`;
}

/**
 * The latest PUBLISHED cycle. An unpublished cycle is still being reviewed and
 * its aggregate is not a fact yet.
 *
 * Returns null when no cycle has been published — which is the situation
 * today, and the caller turns it into an empty summary rather than an error.
 */
export async function latestEcho(seatId: number | null): Promise<EchoSummaryView | null> {
  const cycle = await pool.query<{
    id: number;
    label: string;
    voices: string;
    zones_reached: number;
    zones_total: number;
    spread_seconds: string;
  }>(
    `SELECT id, label, voices, zones_reached, zones_total, spread_seconds
       FROM echo_cycles WHERE published_at IS NOT NULL
      ORDER BY moment_utc DESC LIMIT 1`,
  );
  const row = cycle.rows[0];
  if (!row) return null;

  const [captures, record] = await Promise.all([
    pool.query<{ place: string; local_time: string; note: string }>(
      `SELECT place, local_time, note FROM echo_submissions
        WHERE cycle_id = $1 AND state = 'published'
        ORDER BY created_at LIMIT 60`,
      [row.id],
    ),
    seatId === null
      ? Promise.resolve(null)
      : pool.query<{
          deviation_ms: number | null;
          created_at: Date;
          place: string;
          zone_offset: number | null;
          cell_name: string | null;
          captured_seconds: number | null;
          audio_ref: string | null;
        }>(
          `SELECT e.deviation_ms, e.created_at, e.place, e.zone_offset,
                  c.name AS cell_name, e.captured_seconds, e.audio_ref
             FROM echo_submissions e
             LEFT JOIN cells c ON c.id = e.cell_id
            WHERE e.cycle_id = $1 AND e.seat_id = $2 AND e.withdrawn_at IS NULL
            ORDER BY e.created_at DESC LIMIT 1`,
          [row.id, seatId],
        ),
  ]);

  // The seat's own card is shown to that seat whatever its review state — it
  // is their own submission, not somebody else's, so clearance and consent do
  // not gate it. Only the public `captures` list is restricted to published.
  const own = record?.rows[0] ?? null;

  return {
    cycleLabel: row.label,
    voices: Number(row.voices),
    zonesReached: row.zones_reached,
    zonesTotal: row.zones_total,
    spreadSeconds: Number(row.spread_seconds),
    record: own
      ? {
          deviationMs: own.deviation_ms ?? 0,
          timestamp: new Date(own.created_at).toISOString(),
          location: own.place,
          zoneLabel: zoneLabel(own.zone_offset),
          cellName: own.cell_name,
          capturedSeconds: own.captured_seconds ?? 0,
          uploaded: own.audio_ref !== null,
        }
      : null,
    captures: captures.rows.map((c) => ({
      place: c.place,
      localTime: c.local_time,
      note: c.note,
    })),
  };
}
