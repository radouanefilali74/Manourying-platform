/**
 * The app-facing waitlist routes.
 *
 * Unauthenticated by definition — the whole point is the person who arrived
 * without an invite. Identity is the `X-Device-Key` secret described in
 * domain/waitlist.ts; only its SHA-256 is ever stored.
 */
import type { FastifyInstance } from 'fastify';
import { badRequest } from '../../lib/errors.ts';
import { rateLimit } from '../../plugins/rateLimit.ts';
import { DEVICE_HEADER } from '../../lib/headers.ts';
import { currentWaitlist, joinWaitlist } from '../../domain/waitlist.ts';

/** Long enough that a guess is worthless, short enough to be storable. */
const MIN_KEY_LENGTH = 16;
const MAX_KEY_LENGTH = 200;

function deviceKey(headers: Record<string, unknown>): string {
  const raw = headers[DEVICE_HEADER];
  const key = typeof raw === 'string' ? raw.trim() : '';
  if (key.length < MIN_KEY_LENGTH || key.length > MAX_KEY_LENGTH) {
    throw badRequest('That request was missing its device key.');
  }
  return key;
}

const zoneOffset = { type: 'integer', minimum: -11, maximum: 12 } as const;

export default async function waitlistRoutes(app: FastifyInstance) {
  app.post(
    '/waitlist',
    {
      preHandler: [rateLimit('waitlist', 20, 3600)],
      schema: {
        body: {
          type: 'object',
          required: ['zoneOffset'],
          additionalProperties: false,
          properties: { zoneOffset },
        },
      },
    },
    async (request) => {
      const key = deviceKey(request.headers as Record<string, unknown>);
      const { zoneOffset: zone } = request.body as { zoneOffset: number };
      return joinWaitlist(key, zone);
    },
  );

  /**
   * Returns `null`, not 404, when this device is not on the list. The app's
   * `currentWaitlist()` is typed `WaitlistEntry | null` and a fresh install
   * asking the question is the normal case, not an error.
   */
  app.get('/waitlist/me', async (request) => {
    const key = deviceKey(request.headers as Record<string, unknown>);
    return currentWaitlist(key);
  });
}
