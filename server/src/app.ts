/**
 * The Fastify app.
 *
 * Split from index.ts so tests can build a server without listening on a port.
 *
 * Note what is NOT here: @fastify/helmet. nginx owns every security header on
 * this vhost and strips any the app emits — two sources of a CSP means the
 * browser enforces their intersection, which is the trap documented at length
 * in /etc/nginx/sites-available/law.manouri.ovh. One owner per header.
 *
 * Fastify's JSON-Schema validation is why there is no zod here. The legal-tech
 * backend next door needs a validation library because Express has none; this
 * one does not.
 */
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { env } from './env.ts';
import { pool } from './db/pool.ts';
import { redisHealthy } from './redis.ts';
import { AppError } from './lib/errors.ts';
import sessionPlugin from './plugins/session.ts';
import { CSRF_HEADER } from './plugins/csrf.ts';
import { DEVICE_HEADER } from './lib/headers.ts';
import authRoutes from './routes/admin/auth.ts';
import counterRoutes from './routes/admin/counters.ts';
import seatRoutes from './routes/admin/seats.ts';

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.isProduction ? 'info' : 'debug',
      // journald stamps every line already; a second timestamp is noise.
      ...(env.isProduction ? { timestamp: false } : {}),
    },
    // nginx is the only thing that can reach this socket, so its
    // X-Forwarded-For is trustworthy — and it is what the login lockout keys on.
    trustProxy: true,

    // Deprecated in fastify@5 and removed in @6, which wants a `logController`
    // CLASS rather than a flag. Left as-is on purpose: the replacement is a
    // subclass to write and test, the warning is one line once per boot, and
    // nginx's access log already records every request. Revisit when upgrading
    // to fastify@6, not before.
    disableRequestLogging: true,
    bodyLimit: 256 * 1024,
  });

  await app.register(cookie);

  // Exactly one origin, never a wildcard — `*` is not even permitted alongside
  // credentials, and the session cookie rides on every panel request.
  await app.register(cors, {
    origin: env.adminOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['content-type', 'authorization', CSRF_HEADER, DEVICE_HEADER],
    maxAge: 600,
  });

  await app.register(sessionPlugin);

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof AppError) {
      reply.code(error.status);
      return {
        error: {
          code: error.code,
          message: error.message,
          requestId: request.id,
          ...(error.detail ? { detail: error.detail } : {}),
        },
      };
    }

    // Fastify's own schema validation failures.
    if (error.validation) {
      reply.code(400);
      return {
        error: {
          code: 'invalid_request',
          message: 'That request was not in the expected shape.',
          requestId: request.id,
          detail: { validation: error.message },
        },
      };
    }

    // Anything unrecognised: log the real thing, tell the client nothing.
    request.log.error({ err: error }, 'unhandled error');
    reply.code(error.statusCode && error.statusCode < 500 ? error.statusCode : 500);
    return {
      error: {
        code: 'internal',
        message: 'Something went wrong on our side.',
        requestId: request.id,
      },
    };
  });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404);
    return {
      error: { code: 'not_found', message: 'Not found.', requestId: request.id },
    };
  });

  app.get('/healthz', async () => {
    const [db, redis] = await Promise.all([checkDatabase(), redisHealthy()]);
    return { ok: db === 'up' && redis === 'up', db, redis, env: env.nodeEnv };
  });

  await app.register(authRoutes);
  await app.register(counterRoutes);
  await app.register(seatRoutes);

  /**
   * The app-facing routes. All of them are implemented against the same tables
   * the admin panel reads, and all of them are rate limited — but reaching
   * them still requires TWO switches to flip: PUBLIC_API here, and nginx
   * actually proxying those paths.
   *
   * Registered together rather than individually: a half-mounted app-facing
   * API is worse than none, because the adapter cannot tell "not built yet"
   * from "misconfigured".
   */
  if (env.publicApi) {
    app.log.warn('PUBLIC_API is on — the app-facing routes are mounted');
    const [seats, counts, waitlist, cells, echo] = await Promise.all([
      import('./routes/public/seats.ts'),
      import('./routes/public/counts.ts'),
      import('./routes/public/waitlist.ts'),
      import('./routes/public/cells.ts'),
      import('./routes/public/echo.ts'),
    ]);
    await app.register(seats.default);
    await app.register(counts.default);
    await app.register(waitlist.default);
    await app.register(cells.default);
    await app.register(echo.default);
  }

  return app;
}

async function checkDatabase(): Promise<'up' | 'down'> {
  try {
    await pool.query('SELECT 1');
    return 'up';
  } catch {
    return 'down';
  }
}
