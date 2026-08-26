import type { Locale } from './dictionary';

export type PageKey =
  | 'index'
  | 'whatThisIs'
  | 'faq'
  | 'privacy'
  | 'press'
  | 'install'
  | 'directive'
  | 'gate'
  | 'notFound';

/** The canonical (English, unprefixed) path for each page. Never changes — see CLAUDE.md. */
export const PAGE_PATH: Record<PageKey, string> = {
  index: '/',
  whatThisIs: '/what-this-is',
  faq: '/faq',
  privacy: '/privacy',
  press: '/press',
  install: '/install',
  directive: '/directive',
  gate: '/gate',
  notFound: '/404',
};

/**
 * Which locales currently have REAL, migrated content for each page — the
 * single source of truth the nav, the language switcher, and hreflang all
 * read from in Base.astro.
 *
 * A page/locale pair not listed here does not exist yet, and nothing should
 * link to it: this is what stops the nav or the switcher from ever pointing
 * at a 404 mid-rollout. Update this in the SAME commit a page gains a new
 * locale — nowhere else, or the switcher and the nav can drift apart.
 */
export const PAGE_LOCALES: Record<PageKey, readonly Locale[]> = {
  index: ['en', 'fr', 'ar'],
  whatThisIs: ['en', 'fr', 'ar'],
  faq: ['en', 'fr', 'ar'],
  privacy: ['en', 'fr', 'ar'],
  press: ['en', 'fr', 'ar'],
  install: ['en', 'fr', 'ar'],
  directive: ['en', 'fr', 'ar'],
  gate: ['en', 'fr', 'ar'],
  notFound: ['en', 'fr', 'ar'],
};
