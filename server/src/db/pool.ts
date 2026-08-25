/**
 * The Postgres pool — one per process.
 *
 * Every query in this codebase is parameterised. There is no query builder and
 * no string interpolation into SQL, anywhere; if a helper is ever added that
 * makes that easy, it is a mistake.
 */
import pg from 'pg';
import { env } from '../env.js';

/**
 * bigint columns come back as strings by default, because a Postgres bigint can
 * exceed Number.MAX_SAFE_INTEGER. Every id and counter here is comfortably
 * inside that range and the app's own types (`seatCount(): Promise<number>`)
 * expect numbers, so parse them — but keep this in one place so the decision is
 * visible rather than rediscovered per query.
 */
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number(value));

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // A runaway query on the admin panel should fail rather than pin a connection.
  statement_timeout: 15_000,
});

export type Queryable = Pick<pg.Pool, 'query'> | pg.PoolClient;

/**
 * Runs `fn` inside a transaction, rolling back on any throw.
 *
 * The seat-claim path uses this: it inserts a speculative seat, then tries to
 * win the invite with a conditional UPDATE, and a loser's rollback is what
 * removes the seat it had already inserted.
 */
export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
