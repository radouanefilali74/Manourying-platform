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

/**
 * Each language's own name for itself, always rendered in its own script
 * regardless of the current page's locale — standard practice for a language
 * switcher, and how every major site's picker works. Not translated content:
 * "Français" reads as "Français" on the English page too.
 */
export const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  de: 'Deutsch',
  ko: '한국어',
  zh: '中文',
  ja: '日本語',
  ru: 'Русский',
  it: 'Italiano',
  pt: 'Português',
};

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

  index: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    /** Split around `{RITUAL_SECONDS}`, which is a config value, not translated. */
    ledePrefix: string;
    ledeSuffix: string;
    ctaGetApp: string;
    ctaWhatThisIs: string;
    scoreEyebrow: string;
    /** English is `SCORE` itself, imported — see en.ts; the wording is already public on this page today. */
    score: { at: string; heading: string; detail: string }[];
    scoreFineBefore: string;
    /** The text of the link to /directive. */
    scoreFineLink: string;
    factsPitchEyebrow: string;
    factsPitchNote: string;
    factsInstantEyebrow: string;
    factsInstantNote: string;
    factsNotifEyebrow: string;
    /** The word "Two" as prose, not a numeral — translated like any other word. */
    factsNotifValue: string;
    factsNotifNote: string;
    closingHeading: string;
    closingBody: string;
    moreLink: string;
    /**
     * Countdown.astro's client-side strings. Scoped here rather than under
     * `common` because only this page uses the component today — move it if
     * a second page ever needs it.
     */
    countdown: {
      /** Static fallback shown before JS enhances the ticking numbers. */
      fallback: string;
      wherePrefix: string;
      whereMidnight: string;
      whereEarlyMorning: string;
      wherePeriod: string;
      passed: string;
      /** Contains the literal token `{{DAYS}}`, substituted client-side. */
      daysUntil: string;
    };
  };

  faq: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    /**
     * `q`/`a` may contain the literal tokens `{{TONE_HZ}}` or
     * `{{CONTACT_EMAIL}}` — FaqPage.astro substitutes both after rendering.
     * A token, not a template function, because only 2 of 11 items need one
     * and every locale's array should stay a plain, easy-to-review list.
     */
    items: { q: string; a: string }[];
  };

  privacy: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lede: string;
    seatHeading: string;
    seatBody: string;
    storesHeading: string;
    storesItems: string[];
    storesFooter: string;
    neverHeading: string;
    neverItems: string[];
    micHeading: string;
    micIntro: string;
    micItems: string[];
    bystanderHeading: string;
    bystanderP1: string;
    bystanderP2: string;
    /** Text up to, but not including, the mailto link. */
    bystanderP3Before: string;
    bystanderP3After: string;
    siteHeading: string;
    siteBody: string;
    rightsHeading: string;
    rightsBefore: string;
    rightsAfter: string;
    /** "Last updated {date}." — split around the date, which stays as the config/source value. */
    lastUpdatedPrefix: string;
    lastUpdatedSuffix: string;
    /**
     * Shown only on this page, beneath the shared translation notice — Privacy
     * carries GDPR-facing claims and gets a second, more explicit sentence.
     */
    legalReviewNotice: string | null;
  };

  press: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lede: string;
    oneParagraphHeading: string;
    /** `{TONE_HZ}` is interpolated by the template, not translated. */
    quoteBefore: string;
    quoteAfter: string;
    factsHeading: string;
    factInstant: string;
    factDuration: string;
    factDurationValue: string;
    factPitch: string;
    factCadence: string;
    factCadenceValue: string;
    factEntry: string;
    factEntryValue: string;
    factPlatforms: string;
    factPlatformsValue: string;
    factCost: string;
    factCostValue: string;
    threeThingsHeading: string;
    threeThingsIntro: string;
    thingSeismic: { strong: string; rest: string };
    thingSimultaneous: { strong: string; rest: string };
    thingCampaign: { strong: string; rest: string };
    contactHeading: string;
    contactBefore: string;
    contactAfter: string;
    canonicalLabel: string;
  };

  install: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lede: string;
    platformLabel: Record<'android' | 'ios', string>;
    notYet: string;
    installFor: string;
    haveCodeHeading: string;
    haveCodeBody: string;
    noCodeHeading: string;
    noCodeBody: string;
    /** Text up to, but not including, the mailto link. */
    brokenBefore: string;
  };

  directive: {
    title: string;
    description: string;
    eyebrowSealed: string;
    eyebrowOpen: string;
    h1: string;
    lede: string;
    sealEyebrow: string;
    copyButton: string;
    copiedLabel: string;
    checkHeading: string;
    /** Split around the mono `{unseal}` timestamp. */
    checkP1Before: string;
    checkP1After: string;
    checkP2: string;
    knownHeading: string;
    knownBody: string;
    footerFine: string;
  };

  gate: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    codeEyebrow: string;
    copyButton: string;
    copiedLabel: string;
    codeFine: string;
    noCodeLede: string;
    invitedHeading: string;
    invitedBody: string;
    /** Text up to, but not including, the /what-this-is link. */
    invitedLinkBefore: string;
    invitedLink: string;
    invitedLinkAfter: string;
    nextHeading: string;
    nextSteps: string[];
    ctaGetApp: string;
    footerFine: string;
  };

  notFound: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lede: string;
    linkWhatThisIs: string;
    linkFaq: string;
    linkInstall: string;
  };
}
