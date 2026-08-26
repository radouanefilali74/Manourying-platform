import type { Dictionary, Locale } from './dictionary';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

const dictionaries: Partial<Record<Locale, Dictionary>> = { en, fr, ar };

/**
 * Falls back to English if a locale has no dictionary file yet. This should
 * only ever trigger for a locale/page combination not listed in
 * `pages.ts`'s `PAGE_LOCALES` — and nothing should be generating a link to
 * that combination in the first place, so hitting this fallback in practice
 * means the two files have drifted out of sync.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export * from './dictionary';
export * from './pages';
export * from './fonts';
