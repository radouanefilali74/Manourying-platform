/**
 * The Fastify app.
 *
 * Split from index.ts so tests can build a server without listening on a port.
 *
 * Note what is NOT here: @fastify/helmet. nginx owns every security header on
 * this vhost and strips any the app emits — two sources of a CSP means the
 * browser enforces their intersection, which is the trap documented at length in
 * /etc/nginx/sites-available/law.manouri.ovh. One owner per header.
 */
import Fastify, { type FastifyInstance } from 'fastify';
import { env } from './env.js';
import { pool } from './db/pool.js';

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.isProduction ? 'info' : 'debug',
      // journald adds its own timestamps; a second one in every line is noise.
      ...(env.isProduction ? { timestamp: false } : {}),
    },
    // nginx sets X-Forwarded-For and is the only thing that can reach this
    // socket, so the forwarded address is trustworthy here — and it is what the
    // login rate limiter keys on.
    trustProxy: true,
    disableRequestLogging: true,
    bodyLimit: 256 * 1024,
  });

  app.get('/healthz', async () => {
    const [db, redis] = await Promise.all([checkDatabase(), Promise.resolve('skipped' as const)]);
    return { ok: db === 'up', db, redis, version: env.nodeEnv };
  });

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
