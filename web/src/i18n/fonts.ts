import type { Locale } from './dictionary';

/**
 * Extra Google Fonts needed for scripts IBM Plex Sans / Instrument Serif do
 * not cover. Loaded per-locale in Base.astro's `<head>` — a French visitor
 * never requests the Arabic or CJK font files.
 *
 * Latin locales (en, fr, es, de, it, pt) and Russian need nothing here:
 * Plex covers Cyrillic for body/mono text, and Instrument Serif's existing
 * fallback stack (`Georgia, 'Times New Roman', serif`) already covers
 * Cyrillic headings — a documented, acceptable degradation, not a gap to fill.
 */
export const LOCALE_FONT_QUERY: Partial<Record<Locale, string>> = {
  ar: 'family=IBM+Plex+Sans+Arabic:wght@300;400;500',
  ko: 'family=Noto+Sans+KR:wght@300;400;500',
  zh: 'family=Noto+Sans+SC:wght@300;400;500',
  ja: 'family=Noto+Sans+JP:wght@300;400;500',
};

/** Prepended to `--sans` for the locales above, so headings/body actually render the script. */
export const LOCALE_SANS_STACK: Partial<Record<Locale, string>> = {
  ar: "'IBM Plex Sans Arabic'",
  ko: "'Noto Sans KR'",
  zh: "'Noto Sans SC'",
  ja: "'Noto Sans JP'",
};
