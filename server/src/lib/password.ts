/**
 * Argon2id password hashing.
 *
 * Parameters are deliberately above OWASP's floor (19 MiB / t=2 / p=1): there
 * are at most a handful of admins and nobody minds a login taking 150 ms.
 *
 * Do NOT raise memoryCost without checking `MemoryMax` in
 * deploy/systemd/manourying-api.service — the cost is memory × concurrent
 * logins, and that product is the one thing in this service that can balloon.
 */
import { hash, verify } from '@node-rs/argon2';

/**
 * `Algorithm.Argon2id` from @node-rs/argon2, spelled as its literal value.
 *
 * The package declares Algorithm as an ambient `const enum`, which cannot be
 * referenced under `verbatimModuleSyntax` — there is no runtime object to read
 * it from. It is also the library's own default, so this is belt and braces;
 * stating it explicitly means a future default change cannot silently move
 * every stored hash to a different algorithm.
 */
const ARGON2ID = 2;

const OPTIONS = {
  algorithm: ARGON2ID,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
  outputLen: 32,
} as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(digest: string, password: string): Promise<boolean> {
  try {
    return await verify(digest, password, OPTIONS);
  } catch {
    // A malformed stored hash must read as "wrong password", never as a crash
    // that distinguishes this account from any other.
    return false;
  }
}

/**
 * A real argon2id hash of a value nobody knows, verified against when the email
 * is unknown so that the response takes the same time either way.
 *
 * Without this, "no such admin" returns in microseconds while "wrong password"
 * takes 150 ms, and the login endpoint becomes an oracle for which addresses
 * are administrators.
 *
 * Computed once at module load rather than baked in as a literal, so it can
 * never drift from OPTIONS above.
 */
const dummyHash: Promise<string> = hashPassword(
  'not-a-password-just-something-to-burn-the-same-milliseconds',
);

export async function burnTiming(password: string): Promise<void> {
  await verifyPassword(await dummyHash, password);
}
