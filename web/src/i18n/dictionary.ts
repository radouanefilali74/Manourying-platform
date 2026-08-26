/**
 * The Dictionary type — every page's user-facing string, once, so a missing
 * translation is a TypeScript error (caught by `astro check`, part of
 * `npm run verify`) rather than a silent English leak or a runtime crash.
 *
 * Astro's own `i18n` config (astro.config.mjs) only handles routing — URL
 * structure, `Astro.currentLocale`, `getRelativeLocaleUrl()`. It does not
 * provide a string dictionary. This file, and the locale files that implement
 * it, are that missing piece.
 *
 * Grows one page-section at a time, in step with which pages have actually
 * been migrated — see `pages.ts` for the locale × page matrix that tracks
 * what is real content versus not yet translated.
 */
import type { Section } from '../content/explainer';

export const LOCALES = [
  'en',
  'fr',
  'ar',
  'es',
  'de',
  'ko',
  'zh',
  'ja',
  'ru',
  'it',
  'pt',
] as const;

export type Locale = (typeof LOCALES)[number];

/** The only script in this set that reads right-to-left. */
export const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar']);

export type NavKey = 'whatThisIs' | 'faq' | 'directive' | 'privacy' | 'press';

export interface Dictionary {
  common: {
    skipToContent: string;
    nav: Record<NavKey, string>;
    footerTagline: string;
    /**
     * Shown on every non-English page, per the decision to draft translations
     * now but mark them clearly unreviewed. `null` for English, because
     * English is the reviewed source text, not a translation of anything.
     */
    translationNotice: string | null;
  };

  whatThisIs: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    intro: string;
    /** English is `EXPLAINER` itself, imported — see en.ts. Other locales are new prose. */
    sections: Section[];
    whoBehindHeading: string;
    /** Text up to, but not including, the mailto link — the template always appends "<email>." itself. */
    whoBehindBody: string;
    closingFine: string;
  };
}
