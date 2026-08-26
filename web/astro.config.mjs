// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Static output. The whole site is prerendered and served by Caddy off the VPS
 * as plain files — no Node process in front of the marketing pages, so the one
 * page the spec insists must always be reachable cannot be taken down by an
 * application crash.
 */
export default defineConfig({
  site: 'https://manourying.manouri.ovh',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit `/faq.html` rather than `/faq/index.html` so Caddy can serve clean
    // URLs with `try_files` and no redirect dance.
    format: 'file',
  },
  devToolbar: { enabled: false },

  /**
   * `prefixDefaultLocale: false` is what keeps every current URL exactly as
   * it is: English is the default locale, so `/faq`, `/what-this-is`,
   * `/install` and `/gate` stay unprefixed — those last three are stable URLs
   * printed in App Store review notes and linked from inside the app, and
   * CLAUDE.md is explicit that they must never move. Every other locale gets
   * a prefix (`/fr/faq`, `/ar/what-this-is`, …), added alongside the English
   * page rather than replacing it.
   *
   * With `build.format: 'file'`, a locale route emits e.g. `fr/faq.html`,
   * which the existing nginx `try_files $uri $uri.html $uri/index.html =404`
   * already serves — no nginx change needed for this.
   *
   * Astro's i18n config handles ROUTING only (URL structure,
   * `Astro.currentLocale`, `getRelativeLocaleUrl()`). The actual string
   * dictionary lives in `src/i18n/`, since Astro core does not provide one.
   */
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar', 'es', 'de', 'ko', 'zh', 'ja', 'ru', 'it', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
