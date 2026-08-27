/**
 * Rate limiting for the unauthenticated app-facing routes.
 *
 * The admin side has had this since it existed — login is limited per IP and
 * per email. The app-facing routes had nothing, which was survivable only
 * because they were switched off. `POST /seats` spends invite codes and
 * `POST /waitlist` and `POST /cells` both write, so all three need a ceiling
 * before those switches flip.
 *
 * Keyed on `request.ip`, which is trustworthy here: nginx is the only thing
 * that can reach this socket and `trustProxy` is on, so this is the real
 * client address rather than a header anybody can set.
 *
 * This is a ceiling on abuse, not a fairness mechanism. The limits are set
 * well above what a person tapping a button can produce and well below what
 * makes code-guessing or queue-stuffing worthwhile.
 */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { bump } from '../redis.ts';
import { tooMany } from '../lib/errors.ts';

export function rateLimit(bucket: string, max: number, windowSeconds: number) {
  return async function limiter(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { count, resetIn } = await bump(`rl:${bucket}:${request.ip}`, windowSeconds);
    if (count > max) {
      reply.header('Retry-After', String(resetIn));
      throw tooMany('Too many requests. Try again shortly.', resetIn);
    }
  };
}
