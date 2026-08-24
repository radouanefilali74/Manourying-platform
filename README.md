# Manourying — platform

The public website, and (in later phases) the API and admin panel behind
[the mobile app](../manourying).

Everything is self-hosted on the OVH VPS behind `manourying.manouri.ovh`.

```
web/      Astro static site        → manourying.manouri.ovh      ← LIVE
server/   Fastify + Postgres API   → api.manourying.manouri.ovh  ← phase 2
admin/    Vite + React admin panel → admin.…                     ← phase 3
db/       schema + migrations                                    ← phase 2
deploy/   nginx vhost, publish script, app-links templates, deployment notes
scripts/  parity gates
```

## Why this is a separate repo

The mobile app's Expo project sits at *its* repo root, so a `server/` beside it would land inside
Metro's watch root and inside the `**/*.ts` glob in its `tsconfig.json` and Jest config — breaking
`npm run verify` over there for no benefit.

## Running it

```bash
cd web && npm install
npm run dev          # http://localhost:4321
```

From the repo root:

```bash
npm run verify       # astro check + parity gate + build
npm run deploy       # publish to manourying.manouri.ovh (run on the VPS)
npm run push -- "feat: ..."   # verify, commit everything, push to GitHub
```

The repo lives on the VPS, and the site is served by nginx straight off the filesystem, so
deploying is a build plus a directory swap — see [deploy/DEPLOY.md](deploy/DEPLOY.md).

Publishing to the VPS and pushing to GitHub are separate acts: `npm run deploy` changes what
visitors see, `npm run push` changes what the repo says. [deploy/push.sh](deploy/push.sh) runs
the verify gate *before* committing, so a tree that fails parity never reaches origin — the
source of the published seal hash and the seal hash itself cannot drift apart in the history.

## The parity gate

The site and the app ship independently, and the moment they disagree about the instant, the pitch,
or the directive, the project's central promise — *you can verify nothing was changed* — stops being
true.

`npm run check:parity` reads the app's own source and fails the build on any difference:

```
parity: site and app agree
  ✓ directive sha256 5d0f8aaae2d5209b…
  ✓ the moment 2026-09-23T14:05:00Z
  ✓ the tone 110
```

The published SHA-256 on `/directive` is computed at build time from `web/src/lib/directive.ts`,
and that file must stay byte-identical to `DIRECTIVE_STEPS` in the app. Do not retype it — run
`npm run directive:hash` to extract it from the app's source, and copy across.

## Pages

| Route | Why it exists |
|---|---|
| `/` | Landing: the instant, a countdown, what the sixteen seconds are |
| `/what-this-is` | **The page the spec demands.** Stable URL — never move it. Linked from App Store review notes and from inside the app |
| `/faq` | The hostile questions, answered directly |
| `/privacy` | The microphone position and the bystander problem, stated plainly |
| `/press` | A paragraph to quote, facts to check, and three claims we refuse |
| `/directive` | The published seal hash |
| `/install` | Permanent install URL, so an expiring build link never breaks an old invite |
| `/gate` | Where an invite link lands when the app is not installed |

## Things worth knowing

- **`/install` exists to protect the app from this repo.** The app used to hardcode a link to one
  specific EAS build, which expires; it now points at `/install`, and only
  `web/src/content/builds.ts` changes when a new build is cut.
- **No analytics, no cookies.** Caddy's access log has IP fields stripped — see `deploy/Caddyfile`.
  There is no reason to accumulate a record of who read the privacy page.
- **The countdown is decoration.** It runs on the visitor's own clock. The app measures its offset
  against real time authorities because a countdown that wakes you at the wrong instant is a broken
  product; a web page has no such duty, and the authoritative UTC instant is printed underneath it.
- **App-links files are not deployed.** They need an Apple Team ID and the signing-certificate
  fingerprint. Serving a malformed `assetlinks.json` is worse than serving none — Android caches the
  failure. See `deploy/README.md`.
