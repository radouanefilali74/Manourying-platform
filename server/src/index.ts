/**
 * The entrypoint systemd runs. Nothing else belongs in this file.
 *
 *   ExecStart=…/node --env-file=…/server/.env dist/index.js
 */
import { buildServer } from './app.ts';
import { env } from './env.ts';
import { pool } from './db/pool.ts';
import { redis } from './redis.ts';
import { hydrate, snapshot } from './domain/counters.ts';
import { sweepSessions } from './plugins/session.ts';

const app = await buildServer();

/**
 * Seed Redis from the durable floor BEFORE accepting traffic.
 *
 * Without this, a Redis restart would serve zero for every counter and the
 * published seat count would appear to collapse — exactly the "nobody's count
 * may go backwards" failure the app's contract forbids. A boot that cannot
 * reach Redis still starts; /healthz reports it, and the counters read from the
 * Postgres floor in the meantime.
 */
try {
  await hydrate();
  app.log.info('counters hydrated from the durable floor');
} catch (error) {
  app.log.error({ err: error }, 'could not hydrate counters — serving the Postgres floor');
}

// Bound to loopback: nginx is the only thing that should ever reach this port.
// Exposing it on 0.0.0.0 would put an API with a session cookie on the open
// internet behind nothing at all.
await app.listen({ host: env.host, port: env.port });

const snapshotTimer = setInterval(() => {
  snapshot().catch((error) => app.log.error({ err: error }, 'counter snapshot failed'));
}, 60_000);

const sweepTimer = setInterval(() => {
  sweepSessions().catch((error) => app.log.error({ err: error }, 'session sweep failed'));
}, 3_600_000);

// unref so neither timer holds the process open during shutdown.
snapshotTimer.unref();
sweepTimer.unref();

void sweepSessions().catch(() => {});

async function shutdown(signal: string) {
  app.log.info(`${signal} received, shutting down`);
  clearInterval(snapshotTimer);
  clearInterval(sweepTimer);
  try {
    await app.close();
    // One last snapshot, so increments since the last minute are not lost to
    // a Redis restart that happens while this process is down.
    await snapshot().catch(() => {});
    await pool.end();
    await redis.quit();
    process.exit(0);
  } catch (error) {
    app.log.error({ err: error }, 'shutdown failed');
    process.exit(1);
  }
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => void shutdown(signal));
}
