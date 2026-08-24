# Deployment

Everything runs on the OVH VPS behind `manourying.manouri.ovh`.

## Phase 1 (now): the static site only

```
manourying.manouri.ovh   →  nginx, serving /srv/manourying/web as plain files
```

No application process is in front of the marketing pages. That is deliberate: the spec requires
the explainer to be reachable at a stable URL, and a static file cannot be taken down by a crashed
Node process.

**nginx, not Caddy** — the VPS already runs nginx for `law.manouri.ovh`, and two web servers cannot
share port 443. The repo also lives *on* the VPS, so deploying is a local build and a directory
swap, with nothing to upload:

```bash
./deploy/publish.sh
```

Full procedure, first-time setup, and the rollback in **[DEPLOY.md](DEPLOY.md)**. The vhost is
[`nginx/manourying.manouri.ovh`](nginx/manourying.manouri.ovh); [`Caddyfile`](Caddyfile) is kept as
the reference for the header values and for a future Caddy-based host, but it is not what serves
this site.

## DNS

One `A` record:

```
manourying.manouri.ovh.      A      158.69.219.65
api.manourying.manouri.ovh.  A      158.69.219.65    # phase 2
```

No `AAAA` — the box has IPv6 but publishes none, matching `law.manouri.ovh`.

## Later phases

`api.` and the admin panel arrive in phases 2–3. Add each as its own vhost in `nginx/`, with its own
certificate. Do not add a `reverse_proxy` for a service that does not exist yet — and remember that
nginx here also serves `law.manouri.ovh`, so a config that fails to load takes down more than this
site. Always `sudo nginx -t` before reloading.

## App Links / Universal Links

**Not deployed yet, on purpose.** The template files in `well-known/` are placeholders and are *not*
in `web/public/`, because serving a malformed `assetlinks.json` is worse than serving none: Android
caches the failure and app-link verification silently stops working for everyone until the cache
expires.

Two values are needed before these can go live, and neither can be invented:

| File | Needs | Where to get it |
|---|---|---|
| `apple-app-site-association` | Apple Team ID | Apple Developer account → Membership |
| `assetlinks.json` | SHA-256 of the signing certificate | `eas credentials -p android` — the keystore EAS generated is the source of truth |

Once both are known, fill the templates, move them into `web/public/.well-known/`, rebuild, and
verify with:

```bash
curl -sI https://manourying.manouri.ovh/.well-known/assetlinks.json   # must be application/json
adb shell pm verify-app-links --re-verify com.manourying.app
```

The real test is neither of those: send an invite link to a phone that does **not** have the app and
confirm it lands on `/gate` with the code visible.
