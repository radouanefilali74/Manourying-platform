# Deploying to the VPS

Live at **<https://manourying.manouri.ovh>**, served by **nginx** from the OVH VPS at
`158.69.219.65` (`ubuntu@`, hostname `vps-c9668b59`).

**The repository lives on the VPS itself.** There is no upload step: you build where the files are
already going to be served from. That is the single most important thing to know before reading
any older instructions.

---

## Deploying a change

```bash
cd ~/projects/Manourying-platform
./deploy/publish.sh
```

That script:

1. runs the parity gate against `../Manourying` — refuses to publish if the site's seal hash
   disagrees with the app's,
2. builds the site,
3. refuses to publish if `what-this-is.html` is missing from the build,
4. swaps `/srv/manourying/web` into place with `mv`, so nobody sees a half-copied site,
5. keeps the previous release at `/srv/manourying/web.old`,
6. curls the live URLs and prints the status codes.

No nginx reload is needed: the document root is read from disk on every request, and the config
has not changed.

### If a deploy goes wrong

```bash
sudo rm -rf /srv/manourying/web.bad
sudo mv /srv/manourying/web /srv/manourying/web.bad
sudo mv /srv/manourying/web.old /srv/manourying/web
```

No rebuild, no re-upload — the previous release is already on the box.

---

## How it is wired

```
                        :80  ──► redirect to HTTPS (+ ACME challenge)
manourying.manouri.ovh
                        :443 ──► /srv/manourying/web        (static files, no app process)
```

| Piece | Where |
|---|---|
| vhost (source of truth) | [`nginx/manourying.manouri.ovh`](nginx/manourying.manouri.ovh) in this repo |
| vhost (installed) | `/etc/nginx/sites-available/`, symlinked into `sites-enabled/` |
| document root | `/srv/manourying/web`, owned by `root`, world-readable |
| certificate | `/etc/letsencrypt/live/manourying.manouri.ovh/` |

nginx runs as `www-data` and has read access only. A web server that cannot write its own document
root is one class of compromise removed.

### This box already served something else

`law.manouri.ovh` (Legal Tech Morocco) runs on the same nginx, and **two web servers cannot share
port 443** — which is why this site is served by nginx and not by Caddy, despite
[`Caddyfile`](Caddyfile) sitting in this directory. That file is kept as the reference for the
header values, and for a future host where Caddy *is* the server; it is not what runs here.

Anything that could take nginx down takes `law.manouri.ovh` down with it. So:

- **Always `sudo nginx -t` before reloading.** A vhost that references a certificate file which
  does not exist yet will fail the test — which is exactly why the certificate is obtained *before*
  the vhost is installed (see below).
- **Reload, never restart.** A reload against a broken config leaves the old one running.

### Unknown hostnames get nothing

`conf.d/00-default-catchall.conf` is the `default_server` and returns **444** — connection closed,
no response — for any `Host` that is not explicitly configured. This is deliberate, and it is why
`manourying.manouri.ovh` used to answer with "empty reply from server" before it had a vhost. A
`000` from curl against an unconfigured hostname is the correct result, not a fault.

The parent domain `manouri.ovh` is a retired hostname that the catchall drops on purpose. It is
**not** a regression risk for this deployment; nothing here claims it.

---

## First-time setup (already done — recorded for a rebuild)

The ordering matters. nginx refuses to start if a vhost references a certificate that does not
exist, so the certificate comes first. The catchall already serves `/.well-known/acme-challenge/`
for *any* Host, which means a certificate can be issued with **no nginx configuration change at
all**:

```bash
# 1. Publish the files first — nothing is serving them yet, nothing can break.
sudo mkdir -p /srv/manourying/web
./deploy/publish.sh          # or: cp -rT web/dist /srv/manourying/web

# 2. Certificate, via the catchall's ACME handler. No nginx change.
sudo certbot certonly --webroot -w /var/www/html -d manourying.manouri.ovh --key-type ecdsa

# 3. Only now install the vhost, and only reload if it tests clean.
sudo cp deploy/nginx/manourying.manouri.ovh /etc/nginx/sites-available/
sudo ln -sfn /etc/nginx/sites-available/manourying.manouri.ovh /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

`--webroot`, not `--nginx`: it matches how `law.manouri.ovh` was issued, and it never rewrites
nginx configuration behind your back.

### DNS

One `A` record, already correct:

```
manourying.manouri.ovh.   A   158.69.219.65
```

There is **no AAAA record**, matching `law.manouri.ovh`. The box does have a global IPv6 address and
nginx listens on it, but nothing is published in DNS, so certificate validation and all real
traffic go over IPv4. (An older version of this document claimed an AAAA of `64:ff9b::9e45:db41` —
that is a NAT64 mapping of the IPv4 address, not a DNS record, and `dig` returns nothing for it.)

### Firewall

`ufw` is active and already allows 80 and 443. Port 80 must stay open even though the site
redirects to HTTPS — the ACME HTTP challenge needs it.

### Certificate renewal

`certbot.timer` renews automatically. `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`
reloads nginx after any successful renewal — without it, certbot writes new certificate files that
the running nginx never loads, and the site starts serving an expired certificate about a month
later. The hook applies to every certificate on the box, `law.manouri.ovh` included.

Check it with `sudo certbot renew --dry-run`.

---

## Verify after deploying

```bash
curl -sI https://manourying.manouri.ovh/what-this-is | head -3
curl -s  https://manourying.manouri.ovh/directive | grep -o '5d0f8aaa[a-z0-9 ]*' | head -1
```

The second must print the seal hash in groups, matching what the app computes on device.

Then by hand, because curl cannot judge these:

- [ ] `/` — the countdown runs and shows *your* local landing time
- [ ] `/what-this-is` — loads, **and loads with JavaScript disabled**
- [ ] `/gate?code=RQX5U4` — shows the code in the brass box
- [ ] `https://law.manouri.ovh` — **still does whatever it did before.** The real regression risk
- [ ] The padlock is valid and not self-signed; the fonts load

---

## Later phases

`api.manourying.manouri.ovh` and `admin.` arrive in phases 2–3. Add them as separate vhosts in
`nginx/`, each with its own certificate obtained the same way. Do not add a `reverse_proxy` to a
service that is not running yet.

## App Links / Universal Links

**Not deployed, on purpose.** See [README.md](README.md) — the blocks are written out and commented
in the vhost, ready to uncomment once the Apple Team ID and the Android signing-certificate SHA-256
exist.
