/**
 * Admin authentication.
 *
 * There is no signup route here, and there is not one anywhere else either, in
 * any environment. Admin accounts are created by
 * `npm --prefix server run admin -- create`, which is a deliberate property of
 * the design rather than something to fill in later.
 */
import type { FastifyInstance } from 'fastify';
import { pool } from '../../db/pool.ts';
import { bump, clearKey } from '../../redis.ts';
import { burnTiming, verifyPassword } from '../../lib/password.ts';
import { AppError, tooMany, unauthenticated } from '../../lib/errors.ts';
import { audit } from '../../lib/audit.ts';
import { requireCsrf } from '../../plugins/csrf.ts';
import {
  SESSION_COOKIE,
  clearSessionCookie,
  createSession,
  loadSession,
  requireAdmin,
  revokeSession,
  setSessionCookie,
  type AdminIdentity,
} from '../../plugins/session.ts';

const WINDOW_SECONDS = 15 * 60;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 10;

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: { type: 'string', minLength: 3, maxLength: 254 },
      password: { type: 'string', minLength: 1, maxLength: 512 },
    },
  },
} as const;

type AdminRow = {
  id: number;
  email: string;
  display_name: string;
  role: AdminIdentity['role'];
  password_hash: string;
  disabled_at: Date | null;
};

export default async function authRoutes(app: FastifyInstance) {
  app.post('/admin/auth/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const normalised = email.trim().toLowerCase();
    const ip = request.ip;

    // Two independent windows: per-IP stops one host grinding many accounts,
    // per-email stops a botnet grinding one account.
    const byIp = await bump(`login:ip:${ip}`, WINDOW_SECONDS);
    const byEmail = await bump(`login:email:${normalised}`, WINDOW_SECONDS);

    if (byIp.count > MAX_PER_IP || byEmail.count > MAX_PER_EMAIL) {
      const resetIn = Math.max(byIp.resetIn, byEmail.resetIn);
      reply.header('Retry-After', String(resetIn));
      throw tooMany('Too many attempts. Try again later.', resetIn);
    }

    const { rows } = await pool.query<AdminRow>(
      `SELECT id, email, display_name, role, password_hash, disabled_at
         FROM admins WHERE email = $1`,
      [normalised],
    );
    const admin = rows[0];

    // Unknown address still burns the same milliseconds, so response time does
    // not turn this endpoint into an oracle for which addresses are admins.
    if (!admin) {
      await burnTiming(password);
      throw unauthenticated();
    }

    const ok = await verifyPassword(admin.password_hash, password);

    // Disabled accounts return the SAME error as a wrong password. Saying "this
    // account is disabled" confirms the address exists.
    if (!ok || admin.disabled_at) throw unauthenticated();

    await clearKey(`login:email:${normalised}`);

    const { token, csrfToken } = await createSession(admin.id, {
      ip,
      userAgent: request.headers['user-agent'] ?? null,
    });

    await pool.query('UPDATE admins SET last_login_at = now() WHERE id = $1', [admin.id]);
    await audit(pool, {
      adminId: admin.id,
      action: 'auth.login',
      subjectType: 'admin',
      subjectId: admin.id,
      ip,
    });

    setSessionCookie(reply, token);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        displayName: admin.display_name,
        role: admin.role,
      },
      csrfToken,
    };
  });

  /**
   * How the panel recovers a usable CSRF token after a full page reload — the
   * token is in memory only, so a refresh loses it while the cookie survives.
   */
  app.get('/admin/auth/me', async (request) => {
    await loadSession(request);
    if (!request.session) throw unauthenticated();
    return { admin: request.session.admin, csrfToken: request.session.csrfToken };
  });

  app.post(
    '/admin/auth/logout',
    { preHandler: [requireAdmin, requireCsrf] },
    async (request, reply) => {
      const token = request.cookies[SESSION_COOKIE];
      if (token) await revokeSession(token);

      await audit(pool, {
        adminId: request.admin?.id ?? null,
        action: 'auth.logout',
        subjectType: 'admin',
        subjectId: request.admin?.id ?? null,
        ip: request.ip,
      });

      clearSessionCookie(reply);
      reply.code(204);
      return null;
    },
  );
}

export { AppError };
