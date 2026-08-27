/**
 * The app-facing Echo route.
 *
 * The bearer token is OPTIONAL here: the aggregate belongs to everybody, and
 * only the personal record card needs to know who is asking. A seatless
 * caller gets the same summary with `record: null` rather than a 401.
 */
import type { FastifyInstance } from 'fastify';
import { optionalSeatFromBearer } from '../../domain/seats.ts';
import { latestEcho, type EchoSummaryView } from '../../domain/echo.ts';

/**
 * No cycle has been published yet, and will not be until after the first
 * moment. An empty summary is the honest answer — the screen renders "nothing
 * yet" from these zeroes, where a 404 would make it render an error for a
 * state that is entirely expected.
 */
const EMPTY: EchoSummaryView = {
  cycleLabel: '',
  voices: 0,
  zonesReached: 0,
  zonesTotal: 24,
  spreadSeconds: 0,
  record: null,
  captures: [],
};

export default async function echoRoutes(app: FastifyInstance) {
  app.get('/echo/latest', async (request, reply) => {
    const seatId = await optionalSeatFromBearer(request.headers.authorization);
    const summary = await latestEcho(seatId);

    // Only cacheable for an anonymous caller — the personal record must never
    // be stored by a shared cache and handed to somebody else.
    if (seatId === null) reply.header('Cache-Control', 'public, max-age=60');
    else reply.header('Cache-Control', 'private, no-store');

    return summary ?? EMPTY;
  });
}
