/**
 * CSRF protection for every mutating admin request.
 *
 * WHY THIS IS LOAD-BEARING AND NOT CEREMONY — do not "simplify" it away.
 *
 * The obvious argument for deleting this is "SameSite=Lax already blocks
 * cross-site POSTs". That argument is wrong here, for a reason specific to this
 * box: SameSite is computed on the *registrable domain*, which is manouri.ovh.
 * law.manouri.ovh is a completely separate application, with a separate
 * codebase and a separate threat surface, and it is **same-site** with this API.
 * An XSS or a compromised page over there could issue credentialed POSTs to
 * this API and the browser would attach the session cookie quite happily.
 *
 * The CSRF token is what stops that. It lives only in the panel's own memory,
 * handed over by GET /admin/auth/me, and is never itself in a cookie — so a
 * page on another host can send the cookie but cannot know the token.
 *
 * Enforced at the SCOPE level rather than per route, so that a route added in
 * six months cannot forget it.
 */
import type { FastifyRequest } from 'fastify';
import { env } from '../env.ts';
import { forbidden } from '../lib/errors.ts';
import { safeEqual } from '../lib/tokens.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
export const CSRF_HEADER = 'x-csrf-token';

export async function requireCsrf(request: FastifyRequest): Promise<void> {
  if (SAFE_METHODS.has(request.method)) return;

  // Origin is sent on every cross-origin request and on all same-origin
  // non-GETs from the panel. Checking it is cheap defence in depth; the token
  // below is the actual guarantee, since Origin can be absent in odd clients.
  const origin = request.headers.origin;
  if (origin !== undefined && origin !== env.adminOrigin) {
    throw forbidden('bad_origin', 'That request did not come from the admin panel.');
  }

  const session = request.session;
  if (!session) {
    // requireAdmin runs first and would already have thrown; belt and braces so
    // that a mis-ordered hook cannot silently disable the check.
    throw forbidden('csrf_invalid', 'That request could not be verified. Reload and try again.');
  }

  const presented = request.headers[CSRF_HEADER];
  if (typeof presented !== 'string' || !safeEqual(presented, session.csrfToken)) {
    throw forbidden('csrf_invalid', 'That request could not be verified. Reload and try again.');
  }
}
