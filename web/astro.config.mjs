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
});
