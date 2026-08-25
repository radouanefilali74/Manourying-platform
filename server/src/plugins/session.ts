/**
 * Admin sessions.
 *
 * The cookie carries an opaque 256-bit token; only its SHA-256 is stored, so
 * read access to the database does not hand over live sessions.
 *
 * COOKIE SCOPE — read before changing.
 *
 * The cookie is host-only: it is set on api.manourying.manouri.ovh with NO
 * `Domain` attribute. It still reaches the API from the panel on
 * admin.manourying.manouri.ovh because those two are cross-origin but
 * *same-site* — they share the registrable domain manouri.ovh — so SameSite=Lax
 * sends it, and `credentials: 'include'` plus a non-wildcard CORS origin is all
 * the panel needs.
 *
 * Setting `Domain=.manourying.manouri.ovh` would "work" too, and is worse: the
 * session cookie would then ride along on every request to the public static
 * site, which contradicts what /privacy says about cookies and puts the
 * credential on a surface that has no business seeing it.
 */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../env.ts';
import { pool } from '../db/pool.ts';
import { hashToken, mintToken } from '../lib/tokens.ts';
import { unauthenticated } from '../lib/errors.ts';

export const SESSION_COOKIE = 'mnr_admin';

export type AdminIdentity = {
  id: number;
  email: string;
  displayName: string;
  role: 'owner' | 'operator' | 'reviewer';
};

export type ActiveSession = { id: number; csrfToken: string; admin: AdminIdentity };

declare module 'fastify' {
  interface FastifyRequest {
    session?: ActiveSession;
    admin?: AdminIdentity;
  }
}

/** The attribute set, in one place — a clearing cookie whose attributes differ does not clear. */
function cookieOptions(maxAgeSeconds: number) {
  return {
    path: '/',
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax' as const,
    maxAge: maxAgeSeconds,
    // No `domain`. See the header comment.
  };
}

export async function createSession(
  adminId: number,
  meta: { ip?: string | null; userAgent?: string | null },
): Promise<{ token: string; csrfToken: string }> {
  const token = mintToken();
  const csrfToken = mintToken();

  await pool.query(
    `INSERT INTO admin_sessions (admin_id, token_sha256, csrf_token, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, now() + make_interval(hours => $4), $5, $6)`,
    [adminId, hashToken(token), csrfToken, env.sessionHours, meta.ip ?? null, meta.userAgent ?? null],
  );

  return { token, csrfToken };
}

export function setSessionCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(SESSION_COOKIE, token, cookieOptions(env.sessionHours * 3600));
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.setCookie(SESSION_COOKIE, '', cookieOptions(0));
}

export async function revokeSession(token: string): Promise<void> {
  await pool.query(
    'UPDATE admin_sessions SET revoked_at = now() WHERE token_sha256 = $1 AND revoked_at IS NULL',
    [hashToken(token)],
  );
}

type SessionRow = {
  id: number;
  csrf_token: string;
  admin_id: number;
  email: string;
  display_name: string;
  role: AdminIdentity['role'];
  stale: boolean;
};

async function lookup(token: string): Promise<ActiveSession | null> {
  const { rows } = await pool.query<SessionRow>(
    `SELECT s.id, s.csrf_token, a.id AS admin_id, a.email, a.display_name, a.role,
            (s.last_seen_at < now() - interval '5 minutes') AS stale
       FROM admin_sessions s
       JOIN admins a ON a.id = s.admin_id
      WHERE s.token_sha256 = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > now()
        AND s.last_seen_at > now() - make_interval(hours => $2)
        AND a.disabled_at IS NULL`,
    [hashToken(token), env.sessionIdleHours],
  );

  const row = rows[0];
  if (!row) return null;

  // Only write when the timestamp is actually stale. Refreshing on every
  // request would make a busy panel write once per keystroke-driven refetch.
  if (row.stale) {
    await pool.query('UPDATE admin_sessions SET last_seen_at = now() WHERE id = $1', [row.id]);
  }

  return {
    id: row.id,
    csrfToken: row.csrf_token,
    admin: {
      id: row.admin_id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
    },
  };
}

/** Attaches `request.session` when a valid cookie is present. Does not reject. */
export async function loadSession(request: FastifyRequest): Promise<void> {
  const token = request.cookies[SESSION_COOKIE];
  if (!token) return;
  const session = await lookup(token);
  if (!session) return;
  request.session = session;
  request.admin = session.admin;
}

/** Rejects when there is no valid session. Use as a `preHandler` on `/admin/*`. */
export async function requireAdmin(request: FastifyRequest): Promise<void> {
  await loadSession(request);
  if (!request.session) throw unauthenticated();
}

/** Deletes long-dead rows. Run on boot and hourly; there is no reason to keep them. */
export async function sweepSessions(): Promise<number> {
  const { rowCount } = await pool.query(
    `DELETE FROM admin_sessions WHERE expires_at < now() - interval '30 days'`,
  );
  return rowCount ?? 0;
}

export default fp(async function sessionPlugin(app: FastifyInstance) {
  app.decorateRequest('session', undefined);
  app.decorateRequest('admin', undefined);
});
