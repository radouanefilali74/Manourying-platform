# admin

The Manourying admin panel — a Vite + React SPA, built to static files and served by nginx from
`admin.manourying.manouri.ovh`. There is no application process: the panel calls
`api.manourying.manouri.ovh` from the browser, which is why port 8081 stays free.

```bash
npm --prefix server run dev    # the API on 127.0.0.1:8080
npm --prefix admin  run dev    # the panel on 127.0.0.1:5173
```

Dev is **same-origin through a Vite proxy** (`/admin` and `/healthz` → `:8080`). That removes an
entire category of local cookie pain — a `Secure` cookie is not stored over http, credentialed
cross-origin requests need exactly-right CORS, and Safari is stricter still. Set
`COOKIE_SECURE=false` in `server/.env` for dev.

## Decisions worth not re-litigating

**No data-fetching library.** `src/api.ts` is a `fetch` wrapper and `src/lib/resource.ts` is an
80-line `useResource`/`useMutation` pair. TanStack Query's real value is cache coherence across
many components sharing server state; here each view owns one list and every mutation refetches
that one list, so it would be the largest dependency in the repo serving a panel with a handful of
users. **Revisit if** the panel passes ~15 views or needs cross-view invalidation — but make that a
decision rather than a default.

**The design tokens are imported, not copied.** `vite.config.ts` aliases `@tokens` to
`../web/src/styles/tokens.css`. This repo's whole discipline is that duplicated values must be
gated by `check-parity.mjs`, and adding a third, ungated copy of the tokens would be indefensible.
`src/styles/admin.css` adds only what a marketing site never needed — dense tables, form controls,
the review queue — and never redefines a token.

**No webfonts.** `tokens.css` names IBM Plex and Instrument Serif with real fallback stacks. The
public site loads them from Google; the panel does not, so it touches **zero** third-party origins.
That is the right posture for the surface that can revoke every invite in the system, and it is
why the admin vhost's CSP can say `font-src 'self'`.

**The CSRF token lives in memory, never in a cookie.** `law.manouri.ovh` shares the registrable
domain `manouri.ovh`, so it is *same-site* with the API and `SameSite=Lax` would happily attach our
session cookie for a request originating there. A page on that host can send the cookie but cannot
read the token. `GET /admin/auth/me` is how the panel gets a usable one back after a page reload.

## How this is verified — and what is not

`npm run verify` at the repo root runs `tsc --noEmit` and a production `vite build` over this
package. That catches type errors, bad imports and anything that breaks the bundle.

**It does not catch runtime render errors, and there is currently no browser test.** Playwright's
CDN returns 403 from this VPS ("not available in your location") and no system browser is
installed, so the click-through path has to be checked by hand:

1. sign in with a wrong password — one generic refusal, no hint about the address
2. sign in properly — lands on Overview
3. Counters — recount a figure, confirm the drift column moves and a second recount is refused
4. Seats & invites — mint a batch, confirm the codes appear once and are 10 characters
5. sign out — bounces to `/login`, and a reload does not restore the session

A render-smoke test was tried and dropped: the views are `.tsx`, Node 24 strips types but does not
transform JSX, so it would need vitest — a large dependency for a modest gain over the typecheck
and build that already run.
