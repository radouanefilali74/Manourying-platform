import type { APIRoute } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { SITE_ORIGIN } from '../config';
import { PAGE_LOCALES, PAGE_PATH, type PageKey } from '../i18n';

/**
 * Hand-written rather than pulling in @astrojs/sitemap: this repo's stated
 * ethos is "no dependencies beyond Astro itself" (CLAUDE.md), and the whole
 * thing is a couple of loops over data already sitting at a single source of
 * truth — `PAGE_LOCALES` / `PAGE_PATH` — which is the exact same data every
 * page's own hreflang tags are built from (see Base.astro). Reusing it here
 * rather than re-deriving the URL list means this file cannot drift out of
 * sync with what each page actually claims about itself.
 *
 * One <url> per page/locale combination, each carrying every language
 * variant as an <xhtml:link>, per Google's documented format for
 * multi-language sitemaps:
 * https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
 *
 * `output: 'static'` means this prerenders to a plain file at build time,
 * same as every page — no server, no per-request cost.
 */
const escapeXml = (s: string) => s.replace(/&/g, '&amp;');

export const GET: APIRoute = () => {
  // The 404 page has no business in a sitemap — submitting an error page for
  // indexing is the opposite of what a sitemap is for.
  const pages = (Object.keys(PAGE_LOCALES) as PageKey[]).filter((p) => p !== 'notFound');

  const entries = pages.flatMap((page) => {
    const locales = PAGE_LOCALES[page];
    const path = PAGE_PATH[page];

    const alternateLinks = locales
      .map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(new URL(getRelativeLocaleUrl(l, path), SITE_ORIGIN).href)}"/>`,
      )
      .join('\n');

    // English is the default locale every page's baseline — x-default points
    // at it, matching the x-default tag each page's own <head> already emits.
    const xDefaultLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(new URL(path, SITE_ORIGIN).href)}"/>`;

    return locales.map((l) => {
      const loc = escapeXml(new URL(getRelativeLocaleUrl(l, path), SITE_ORIGIN).href);
      return `  <url>\n    <loc>${loc}</loc>\n${alternateLinks}\n${xDefaultLink}\n  </url>`;
    });
  });

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
