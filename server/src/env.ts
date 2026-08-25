/**
 * The environment, parsed once and validated loudly.
 *
 * systemd starts this process with `--env-file=server/.env` rather than an
 * `EnvironmentFile=` directive, because `systemctl show` prints the contents of
 * an EnvironmentFile in clear text and this one holds the Postgres password.
 * See deploy/systemd/manourying-api.service.
 *
 * A missing or malformed value fails at boot rather than at the first request
 * that needs it. An API that starts and then 500s on login is worse than one
 * that refuses to start with a message naming the variable.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        'Copy server/.env.example to server/.env and fill it in.',
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value === 'true' || value === '1' || value === 'on') return true;
  if (value === 'false' || value === '0' || value === 'off') return false;
  throw new Error(`${name} must be one of true/false/1/0/on/off, got "${value}".`);
}

function integer(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${name} must be an integer, got "${value}".`);
  return parsed;
}

const nodeEnv = optional('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';

export const env = {
  nodeEnv,
  isProduction,

  host: optional('HOST', '127.0.0.1'),
  port: integer('PORT', 8080),

  /** The API's own role. Cannot alter the schema, and can only append to audit_log. */
  databaseUrl: required('DATABASE_URL'),
  redisUrl: optional('REDIS_URL', 'redis://127.0.0.1:6379/3'),

  /**
   * The exact origin the admin panel is served from. Never a wildcard: the
   * session cookie rides on credentialed requests, and `*` is not permitted
   * with credentials anyway.
   */
  adminOrigin: optional('ADMIN_ORIGIN', 'http://127.0.0.1:5173'),

  /**
   * Off in dev only, where the panel is served over http through the Vite
   * proxy and a Secure cookie would never be stored.
   */
  cookieSecure: bool('COOKIE_SECURE', isProduction),

  sessionHours: integer('SESSION_HOURS', 12),
  sessionIdleHours: integer('SESSION_IDLE_HOURS', 2),

  /**
   * The app-facing routes (/seats, /cells, …) are built and tested but not
   * meant to be reachable until the app is wired to this API. Two independent
   * switches must flip: this one, and nginx actually proxying those paths.
   * An unauthenticated POST /cells that nothing uses is pure abuse surface.
   */
  publicApi: bool('PUBLIC_API', false),

  /**
   * Where the two directive sources live on disk, so the publish endpoint can
   * refuse to publish a hash the shipped artefacts do not produce.
   */
  siteRepoPath: optional('SITE_REPO_PATH', new URL('../..', import.meta.url).pathname),
  appRepoPath: optional('APP_REPO_PATH', '../Manourying'),
} as const;

export type Env = typeof env;
