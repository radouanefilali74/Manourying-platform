/**
 * The app-facing cell routes.
 *
 * Reading is open; opening one requires a seat. `opened_by_seat_id` is what
 * lets moderation act on the source of a bad cell rather than only on the
 * cell, and an anonymous POST here would be a spam vector with no handle.
 */
import type { FastifyInstance } from 'fastify';
import { rateLimit } from '../../plugins/rateLimit.ts';
import { seatFromBearer } from '../../domain/seats.ts';
import { listCells, openCell } from '../../domain/cells.ts';

const zoneOffset = { type: 'integer', minimum: -11, maximum: 12 } as const;

export default async function cellRoutes(app: FastifyInstance) {
  /**
   * GET /cells?zone=1[&lat=&lon=]
   *
   * `zone` — not `zoneOffset` — because that is the parameter name the app's
   * own remote.ts stub documents, and the adapter is written against it.
   */
  app.get(
    '/cells',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['zone'],
          properties: {
            zone: { type: 'integer', minimum: -11, maximum: 12 },
            lat: { type: 'number', minimum: -90, maximum: 90 },
            lon: { type: 'number', minimum: -180, maximum: 180 },
          },
        },
      },
    },
    async (request) => {
      const { zone, lat, lon } = request.query as { zone: number; lat?: number; lon?: number };
      const origin = lat !== undefined && lon !== undefined ? { lat, lon } : null;
      return listCells(zone, origin);
    },
  );

  app.post(
    '/cells',
    {
      preHandler: [rateLimit('cells', 10, 3600)],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'kind', 'zoneOffset'],
          additionalProperties: false,
          properties: {
            // Mirrors the cells_name_check / cells_kind_check constraints, so a
            // bad value is a 400 with a useful message rather than a 500 from
            // the database rejecting it.
            name: { type: 'string', minLength: 2, maxLength: 80 },
            kind: { type: 'string', minLength: 1, maxLength: 40 },
            zoneOffset,
            lat: { type: ['number', 'null'], minimum: -90, maximum: 90 },
            lon: { type: ['number', 'null'], minimum: -180, maximum: 180 },
          },
        },
      },
    },
    async (request) => {
      const seatId = await seatFromBearer(request.headers.authorization);
      const body = request.body as {
        name: string;
        kind: string;
        zoneOffset: number;
        lat?: number | null;
        lon?: number | null;
      };
      return openCell(seatId, body);
    },
  );
}
