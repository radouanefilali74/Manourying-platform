/**
 * The entrypoint systemd runs. Nothing else belongs in this file.
 *
 *   ExecStart=…/node --env-file=…/server/.env dist/index.js
 */
import { buildServer } from './app.js';
import { env } from './env.js';
import { pool } from './db/pool.js';

const app = await buildServer();

// Bound to loopback: nginx is the only thing that should ever reach this port.
// Exposing it on 0.0.0.0 would put an API with a session cookie on the open
// internet behind nothing at all.
await app.listen({ host: env.host, port: env.port });

async function shutdown(signal: string) {
  app.log.info(`${signal} received, shutting down`);
  try {
    await app.close();
    await pool.end();
    process.exit(0);
  } catch (error) {
    app.log.error({ err: error }, 'shutdown failed');
    process.exit(1);
  }
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => void shutdown(signal));
}
