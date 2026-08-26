import type { Dictionary, Locale } from './dictionary';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';
import { es } from './es';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { ru } from './ru';
import { ko } from './ko';
import { zh } from './zh';
import { ja } from './ja';

const dictionaries: Record<Locale, Dictionary> = { en, fr, ar, es, de, it, pt, ru, ko, zh, ja };

/**
 * Falls back to English if a locale has no dictionary file yet. In practice
 * every configured locale now has one — `dictionaries` above is a complete
 * `Record<Locale, Dictionary>` — so this fallback is a safety net for a
 * locale/page combination not listed in `pages.ts`'s `PAGE_LOCALES`, which
 * nothing should be generating a link to in the first place.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export * from './dictionary';
export * from './pages';
export * from './fonts';
