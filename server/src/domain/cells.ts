/**
 * Cells — the places people say they will stand.
 *
 * DISTANCE. The app's `Cell.distance` is a human-readable string and its own
 * comment says "the server does the geometry". But `listCells(zoneOffset)`
 * passes no coordinates, so the adapter may add `lat`/`lon` as query
 * parameters when the device has a location fix. Without them there is
 * nothing to measure from, and the field falls back to the em dash the mock
 * already uses for a cell it just created — a displayable value, never null,
 * so no screen has to special-case it.
 */
import { pool } from '../db/pool.ts';
import { increment } from './counters.ts';
import { mintToken } from '../lib/tokens.ts';

export type CellView = {
  id: string;
  name: string;
  distance: string;
  pledged: number;
  kind: string;
  zoneOffset: number;
};

/** What the mock returns for a cell with no measurable distance. */
const NO_DISTANCE = '—';

type Row = {
  public_id: string;
  name: string;
  kind: string;
  zone_offset: number;
  pledged: number;
  distance_m: number | null;
};

/**
 * Metres to the string a person reads. Below a kilometre the round number is
 * the honest one — "847 m" implies a precision a phone fix does not have.
 */
function formatDistance(metres: number | null): string {
  if (metres === null || !Number.isFinite(metres)) return NO_DISTANCE;
  if (metres < 950) return `${Math.round(metres / 50) * 50} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

const view = (row: Row): CellView => ({
  id: row.public_id,
  name: row.name,
  kind: row.kind,
  zoneOffset: row.zone_offset,
  pledged: Number(row.pledged),
  distance: formatDistance(row.distance_m === null ? null : Number(row.distance_m)),
});

/**
 * Visible cells in one zone, nearest first when a fix is supplied and
 * most-pledged first when it is not.
 *
 * Hidden and removed cells never appear here — moderation state is not the
 * app's business, and a removed cell reappearing would make moderation
 * pointless. The `cells_zone_live` partial index covers exactly this query.
 *
 * Distance is computed in SQL with the spherical law of cosines rather than
 * by pulling every row into Node: it keeps the ordering and the limit on the
 * database side, which is the only way LIMIT means "the nearest 200".
 */
export async function listCells(
  zoneOffset: number,
  origin: { lat: number; lon: number } | null,
): Promise<CellView[]> {
  const { rows } = await pool.query<Row>(
    `SELECT public_id, name, kind, zone_offset, pledged,
            CASE WHEN $2::double precision IS NULL OR lat IS NULL THEN NULL ELSE
              6371000 * acos(LEAST(1, GREATEST(-1,
                sin(radians($2)) * sin(radians(lat)) +
                cos(radians($2)) * cos(radians(lat)) * cos(radians(lon - $3))
              )))
            END AS distance_m
       FROM cells
      WHERE zone_offset = $1 AND status = 'visible'
      ORDER BY distance_m ASC NULLS LAST, pledged DESC
      LIMIT 200`,
    [zoneOffset, origin?.lat ?? null, origin?.lon ?? null],
  );
  return rows.map(view);
}

/**
 * Open a cell. Requires a seat — an anonymous write here is a spam vector,
 * and `opened_by_seat_id` is what makes moderation able to act on the source
 * rather than only on the symptom.
 *
 * `public_id` is a minted token rather than the bigint primary key, so the id
 * the app holds leaks nothing about how many cells exist.
 */
export async function openCell(
  seatId: number,
  input: { name: string; kind: string; zoneOffset: number; lat?: number | null; lon?: number | null },
): Promise<CellView> {
  const { rows } = await pool.query<Row>(
    `INSERT INTO cells (public_id, name, kind, zone_offset, lat, lon, opened_by_seat_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING public_id, name, kind, zone_offset, pledged, NULL::double precision AS distance_m`,
    [
      mintToken(),
      input.name.trim(),
      input.kind.trim(),
      input.zoneOffset,
      input.lat ?? null,
      input.lon ?? null,
      seatId,
    ],
  );
  await increment('cells.visible');
  return view(rows[0]!);
}
