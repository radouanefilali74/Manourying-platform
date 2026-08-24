# Deployment

Everything runs on the OVH VPS behind `manourying.manouri.ovh`.

## Phase 1 (now): the static site only

```
manourying.manouri.ovh   →  Caddy, serving web/dist as plain files
```

No application process is in front of the marketing pages. That is deliberate: the spec requires
the explainer to be reachable at a stable URL, and a static file cannot be taken down by a crashed
Node process.

```bash
# on the VPS, once
sudo apt install caddy
sudo mkdir -p /srv/manourying/web

# from your machine, on every deploy
cd web && npm run build
rsync -avz --delete dist/ vps:/srv/manourying/web/
```

Then drop `Caddyfile` into `/etc/caddy/Caddyfile` and `sudo systemctl reload caddy`. Caddy obtains
and renews TLS certificates by itself; there is nothing to configure for HTTPS beyond pointing DNS
at the box first.

## DNS

One `A` record (and `AAAA` if the VPS has IPv6):

```
manourying.manouri.ovh.      A      <vps-ip>
api.manourying.manouri.ovh.  A      <vps-ip>     # phase 2
```

## Later phases

`api.` and the admin panel arrive in phases 2–3 and are already stubbed in the `Caddyfile`, commented
out. Do not uncomment them until the service they proxy to actually exists — Caddy will fail to start
if a reverse-proxy target is unreachable at boot in some configurations, and a broken Caddy takes the
public site down with it.

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
