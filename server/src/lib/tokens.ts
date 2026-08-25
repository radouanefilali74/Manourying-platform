/**
 * Opaque tokens, and the hashing that keeps them out of the database in clear.
 *
 * Session cookies, seat tokens and waitlist device tokens are all the same
 * shape: 32 bytes from a CSPRNG, base64url-encoded. None of them encode
 * anything — they are lookup keys, not claims, so there is no signature to
 * verify and no secret to rotate.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** 32 bytes ≈ 256 bits of entropy — not guessable, and short enough to log an id for. */
export function mintToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Session tokens are stored as their SHA-256, so read access to the database
 * does not hand over live sessions.
 *
 * A plain hash rather than a slow KDF is correct here and would not be for a
 * password: the input is 256 bits of uniform randomness, so there is no
 * dictionary to run and nothing for a work factor to buy.
 */
export function hashToken(token: string): Buffer {
  return createHash('sha256').update(token, 'utf8').digest();
}

/** Constant-time string comparison for secrets of unknown length. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  // timingSafeEqual throws on a length mismatch, which would itself leak the
  // length. Compare digests instead: always equal-length, still constant-time.
  return timingSafeEqual(
    createHash('sha256').update(left).digest(),
    createHash('sha256').update(right).digest(),
  );
}
