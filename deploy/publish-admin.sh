#!/usr/bin/env bash
#
# Publish the admin panel — run this ON the VPS, where the repo lives.
#
#   ./deploy/publish-admin.sh
#
# The panel is static files, so publishing is a build followed by a directory
# swap, exactly like the public site. The swap is a `mv`, not a copy: nobody
# ever sees a half-written panel, and a failed build leaves the live one alone.
set -euo pipefail

ADMIN_ROOT="${ADMIN_ROOT:-/srv/manourying/admin}"
SITE="${SITE:-https://admin.manourying.manouri.ovh}"

cd "$(dirname "$0")/.."

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/4  Verify gate"
npm run verify

say "2/4  Building"
npm --prefix admin run build

# The what-this-is.html analogue. A missing index.html means every route on the
# panel 404s through the try_files fallback, which is a confusing way to find out.
if [ ! -f admin/dist/index.html ]; then
  echo "admin/dist looks wrong — index.html is missing. Refusing to publish." >&2
  exit 1
fi

say "3/4  Swapping into place"
sudo rm -rf "$ADMIN_ROOT.new"
sudo mkdir -p "$ADMIN_ROOT.new"
sudo cp -rT admin/dist "$ADMIN_ROOT.new"

# nginx runs as www-data and needs read access only. A web server that cannot
# write its own document root is one class of compromise removed.
sudo chown -R root:root "$ADMIN_ROOT.new"
sudo chmod -R a+rX "$ADMIN_ROOT.new"

# The previous release is kept as .old, so a bad publish is undone with one mv
# rather than a rebuild.
sudo rm -rf "$ADMIN_ROOT.old"
if [ -d "$ADMIN_ROOT" ]; then sudo mv "$ADMIN_ROOT" "$ADMIN_ROOT.old"; fi
sudo mv "$ADMIN_ROOT.new" "$ADMIN_ROOT"

echo "published $(sudo find "$ADMIN_ROOT" -type f | wc -l) files to $ADMIN_ROOT"

say "4/4  Checking the live panel"
for path in / /login; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE$path" || echo 000)
  printf '  %s  %s\n' "$code" "$path"
done

cat <<EOF

Both should be 200 — the SPA fallback serves index.html for /login too.

Rollback, if that looks wrong:
  sudo rm -rf $ADMIN_ROOT.bad && sudo mv $ADMIN_ROOT $ADMIN_ROOT.bad && sudo mv $ADMIN_ROOT.old $ADMIN_ROOT
EOF
