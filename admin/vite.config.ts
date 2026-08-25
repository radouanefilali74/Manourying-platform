import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      /**
       * The design tokens are IMPORTED from the website, not copied.
       *
       * This repo's whole discipline is that duplicated values must be gated by
       * check-parity.mjs, and CLAUDE.md's parity table already lists
       * web/src/styles/tokens.css against the app's src/ui/tokens.ts as an
       * honour-system pair. Adding a third, ungated copy here would be
       * indefensible. admin.css adds only what a marketing site never needed —
       * dense tables, form controls, the review queue — and never redefines a
       * token.
       */
      '@tokens': fileURLToPath(new URL('../web/src/styles/tokens.css', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    /**
     * Dev is same-origin through this proxy, which removes an entire category of
     * local cookie pain: a Secure cookie is not stored over http, cross-origin
     * credentialed requests need exactly-right CORS, and Safari is stricter
     * still. Proxying means the dev cookie is a plain first-party one.
     */
    proxy: {
      '/admin': 'http://127.0.0.1:8080',
      '/healthz': 'http://127.0.0.1:8080',
    },
    // Required for the @tokens alias to read outside the project root.
    fs: { allow: ['..'] },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
