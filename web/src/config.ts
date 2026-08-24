/**
 * Site configuration — the single source of truth for facts that appear in
 * more than one place.
 *
 * Anything here that also exists in the mobile app is deliberately duplicated
 * rather than imported: the two codebases ship independently, and a build-time
 * dependency between them would mean the website could not be deployed without
 * the app repo present. The rule is that these values are checked against the
 * app's `src/domain/` on every change — see `docs/parity.md`.
 */

/** Where this site lives. Used for canonical URLs, Open Graph, and app links. */
export const SITE_ORIGIN = 'https://manourying.manouri.ovh';

/**
 * The moment itself — 2026-09-23 14:05:00 UTC, the September equinox.
 * Mirrors `MOMENT_UTC` in the app's `src/domain/moment.ts`.
 *
 * EPHEMERIS_TODO: rounded to the minute. Replace with the exact instant from
 * IMCCE or USNO, in both places at once.
 */
export const MOMENT_UTC = '2026-09-23T14:05:00Z';

/** The directive unseals seven days before. */
export const UNSEAL_UTC = '2026-09-16T14:05:00Z';

/** Mirrors the app's `TONE_HZ`. */
export const TONE_HZ = 110;

/** Mirrors the app's ritual timeline: 4s tone, 2s name, 10s silence. */
export const RITUAL_SECONDS = 16;

/** Where the app is actually distributed. Mirrors the app's `INSTALL_URL`. */
export const INSTALL_PATH = '/install';

/**
 * Contact address for press, and for the "who is behind this" question the
 * spec says must have an answer.
 */
export const CONTACT_EMAIL = 'hello@manouri.ovh';

export const NAV = [
  { href: '/what-this-is', label: 'What this is' },
  { href: '/faq', label: 'FAQ' },
  { href: '/directive', label: 'Directive' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/press', label: 'Press' },
] as const;
