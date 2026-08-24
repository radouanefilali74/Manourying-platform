/**
 * The sealed directive, and its hash.
 *
 * These strings are byte-identical to `DIRECTIVE_STEPS` in the mobile app's
 * `src/domain/directive.ts`, and the canonical serialisation below reproduces
 * its `canonicalDirective()` exactly. That is the whole point: the hash this
 * site publishes must equal the hash the app computes on device, or the claim
 * that participants can verify nothing was changed is worse than useless.
 *
 * Do not retype these by hand. `scripts/directive-hash.mjs` extracts them from
 * the app's own source and prints the resulting hash; `npm run check:parity`
 * fails the build if this file has drifted from it.
 */

import { createHash } from 'node:crypto';

export type DirectiveStep = { at: string; heading: string; detail: string };

export const DIRECTIVE_STEPS: readonly DirectiveStep[] = [
  {
    at: '00:00.000',
    heading: 'Hold one open vowel — "ah"',
    detail:
      'Any pitch you can reach comfortably. If you can match 110 Hz, match it. Four seconds. Do not shout.',
  },
  {
    at: '00:04.000',
    heading: 'Say your own name. Once.',
    detail: 'Speaking volume. Whatever name you actually answer to.',
  },
  {
    at: '00:06.000',
    heading: 'Then stop.',
    detail:
      'Ten seconds of silence, wherever you are. This part is not optional — it is the part the recordings are for.',
  },
];

/** Must match `canonicalDirective()` in the app. Order and spacing matter. */
export function canonicalDirective(): string {
  return DIRECTIVE_STEPS.map((s) => `${s.at}\t${s.heading}\t${s.detail}`).join('\n');
}

/**
 * Computed at build time — this runs in Astro's server context, never in the
 * browser, so `node:crypto` is available and the value is baked into the HTML.
 */
export function sealHash(): string {
  return createHash('sha256').update(canonicalDirective(), 'utf8').digest('hex');
}

/** Grouped for display: `5d0f8aaa e2d5209b …`, which is far easier to compare by eye. */
export function groupHash(hash: string, size = 8): string {
  return (hash.match(new RegExp(`.{1,${size}}`, 'g')) ?? []).join(' ');
}
