# Deploying to the VPS

Target: **`ubuntu@158.69.219.65`** serving **`https://manourying.manouri.ovh`**

DNS is already correct — `manourying.manouri.ovh` resolves to `158.69.219.65` (A) and
`64:ff9b::9e45:db41` (AAAA). Nothing to change at OVH.

---

## 0. Pre-flight — do this first

Ports 80 and 443 on the VPS currently **accept a TCP connection and then close without replying**
(`curl` reports "Empty reply from server"). Something is bound to them, or something in front of
them is dropping traffic. Caddy cannot start if another process holds those ports, so find out what
it is before installing anything:

```bash
ssh -i ~/.ssh/vps_85 ubuntu@158.69.219.65

sudo ss -tlnp | grep -E ':80 |:443 '     # what is listening
sudo systemctl list-units --type=service --state=running | grep -Ei 'nginx|apache|caddy|traefik|docker'
sudo docker ps 2>/dev/null               # a container publishing :80 is the usual culprit
```

**This matters beyond Caddy:** `manouri.ovh` — the parent domain — points at the same IP. If you are
already serving something there, whatever you find above is serving it, and you should add
Manourying to *that* server rather than installing Caddy alongside it. The `Caddyfile` in this
directory only ever claims `manourying.manouri.ovh`, so it will not hijack the parent domain, but
two web servers cannot share port 443.

| What you find | What to do |
|---|---|
| Nothing listening | Continue to step 1 — install Caddy |
| **nginx** or **Apache** | Skip Caddy. Use the nginx vhost in step 1b instead |
| A Docker container on `:80` | Either stop it, or reverse-proxy from it — ask me and I will write that config |

---

## 1. One-time server setup

### 1a. If nothing is serving yet — Caddy

Caddy is the recommended path: it obtains and renews TLS certificates on its own, with no certbot,
no cron job, and no renewal that silently expires in ninety days.

```bash
ssh -i ~/.ssh/vps_85 ubuntu@158.69.219.65

# Official Caddy repo (the Ubuntu-bundled version is usually ancient)
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy

sudo mkdir -p /srv/manourying/web /var/log/caddy
sudo chown -R caddy:caddy /srv/manourying /var/log/caddy
```

Then, **from your machine**, install the config and reload:

```bash
cd c:/Users/biibi/Downloads/files/manourying-platform

scp -i ~/.ssh/vps_85 deploy/Caddyfile ubuntu@158.69.219.65:/tmp/Caddyfile
ssh -i ~/.ssh/vps_85 ubuntu@158.69.219.65 '
  sudo mv /tmp/Caddyfile /etc/caddy/Caddyfile &&
  sudo caddy validate --config /etc/caddy/Caddyfile &&
  sudo systemctl reload caddy &&
  sudo systemctl status caddy --no-pager -l | head -20
'
```

`caddy validate` runs before the reload deliberately — a malformed config that fails validation
leaves the running server untouched, rather than taking the site down.

### 1b. If nginx is already there

Do **not** install Caddy. Put this at `/etc/nginx/sites-available/manourying`, symlink it into
`sites-enabled`, and get a certificate with `sudo certbot --nginx -d manourying.manouri.ovh`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name manourying.manouri.ovh;

    root /srv/manourying/web;
    index index.html;

    # The site is built with format:'file', so /faq lives at /faq.html.
    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }

    error_page 404 /404.html;

    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # App-links files must be served as JSON when they eventually exist.
    location = /.well-known/assetlinks.json { default_type application/json; }
    location = /.well-known/apple-app-site-association { default_type application/json; }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy strict-origin-when-cross-origin;
}
```

---

## 2. Deploy

From your machine, one command:

```bash
cd c:/Users/biibi/Downloads/files/manourying-platform
./deploy/deploy.sh
```

That script:

1. runs the parity gate — refuses to deploy if the site's seal hash disagrees with the app's,
2. builds the site,
3. refuses to deploy if `what-this-is.html` is missing (the one page the spec insists must exist),
4. ships a tarball and swaps it into place with `mv`, so nobody sees a half-copied site,
5. keeps the previous release at `/srv/manourying/web.old`,
6. curls the live URLs and prints the status codes.

Every later deploy is the same single command.

### If a deploy goes wrong

```bash
ssh -i ~/.ssh/vps_85 ubuntu@158.69.219.65 '
  sudo rm -rf /srv/manourying/web.bad &&
  sudo mv /srv/manourying/web /srv/manourying/web.bad &&
  sudo mv /srv/manourying/web.old /srv/manourying/web
'
```

No rebuild, no re-upload — the previous release is already on the box.

---

## 3. Verify

```bash
curl -sI https://manourying.manouri.ovh/what-this-is | head -3
curl -s  https://manourying.manouri.ovh/directive | grep -o '5d0f8aaa[a-z0-9 ]*' | head -1
```

The second one should print the seal hash in groups, matching what the app computes on device.

Then check by hand, because these are the things a curl cannot judge:

- [ ] `https://manourying.manouri.ovh/` — the countdown runs and shows *your* local landing time
- [ ] `/what-this-is` — loads, and loads with JavaScript disabled
- [ ] `/gate?code=RQX5U4` — shows the code in the brass box
- [ ] `https://manouri.ovh` — **still does whatever it did before.** This is the regression risk
- [ ] The padlock is valid and not self-signed

Certificates: Caddy fetches them on first request, which can take 10–30 seconds. If you get a TLS
error immediately after `systemctl reload`, wait and retry once before assuming it is broken —
`sudo journalctl -u caddy -f` shows the ACME exchange live.

---

## 4. After it is live

Two follow-ups, in order of how much they matter:

1. **Point the app at the site.** Already done in code — `INSTALL_URL` is
   `https://manourying.manouri.ovh/install`. It takes effect in the next build you cut. Until then,
   invites sent from the current dev build still carry the old expiring EAS link.
2. **App Links.** Needs your Apple Team ID and the Android signing-cert SHA-256
   (`eas credentials -p android`). See `deploy/README.md` — the templates are ready, and I have
   deliberately not deployed them, because a malformed `assetlinks.json` gets cached by Android and
   breaks verification for everyone until the cache expires.

---

## Firewall

If OVH's firewall or `ufw` is on, 80 and 443 must both be open — Caddy needs 80 for the ACME
HTTP challenge even though the site itself redirects to HTTPS:

```bash
sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw status
```
