#!/usr/bin/env bash
#
# Publish the static site — run this ON the VPS, where the repo lives.
#
# The site is served by nginx straight off the filesystem, so publishing is a
# build followed by a directory swap. The swap is a `mv`, not a copy: a visitor
# never sees a half-written site, and a failed build leaves the live one
# completely untouched.
#
#   ./deploy/publish.sh
#
# Override anything via the environment:
#   WEB_ROOT=/srv/other/web APP_REPO=../elsewhere ./deploy/publish.sh
#
# For deploying from a remote workstation instead, see deploy/deploy.sh.
set -euo pipefail

WEB_ROOT="${WEB_ROOT:-/srv/manourying/web}"
APP_REPO="${APP_REPO:-../Manourying}"
SITE="${SITE:-https://manourying.manouri.ovh}"

cd "$(dirname "$0")/.."

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/4  Parity gate"
# Not optional: this publishes the seal hash, and publishing one that disagrees
# with the app is worse than not publishing at all. The path is passed
# explicitly because the script's own default is a *lowercase* directory name
# that does not exist on this case-sensitive filesystem — where it would warn,
# skip the directive comparison, and still exit 0.
if [ ! -d "$APP_REPO" ]; then
  echo "App repo not found at $APP_REPO — cannot verify the seal hash." >&2
  echo "Pass it explicitly:  APP_REPO=../Manourying $0" >&2
  exit 1
fi
node scripts/check-parity.mjs "$APP_REPO"

say "2/4  Building"
npm --prefix web run build

# The one page the spec insists must always be reachable. If the build
# rearranged itself, find out here rather than from a reviewer.
if [ ! -f web/dist/what-this-is.html ]; then
  echo "web/dist looks wrong — the explainer page is missing. Refusing to publish." >&2
  exit 1
fi

say "3/4  Swapping into place"
sudo rm -rf "$WEB_ROOT.new"
sudo mkdir -p "$WEB_ROOT.new"
sudo cp -rT web/dist "$WEB_ROOT.new"

# nginx runs as www-data and needs read access only. A web server that cannot
# write its own document root is one class of compromise removed.
sudo chown -R root:root "$WEB_ROOT.new"
sudo chmod -R a+rX "$WEB_ROOT.new"

# The previous release is kept as .old, so a bad publish is undone with a single
# mv rather than a rebuild.
sudo rm -rf "$WEB_ROOT.old"
if [ -d "$WEB_ROOT" ]; then sudo mv "$WEB_ROOT" "$WEB_ROOT.old"; fi
sudo mv "$WEB_ROOT.new" "$WEB_ROOT"

echo "published $(sudo find "$WEB_ROOT" -type f | wc -l) files to $WEB_ROOT"

# No nginx reload: the document root is served from disk on every request, and
# the config has not changed. Reloading here would be noise.

say "4/4  Checking the live site"
for path in / /what-this-is /directive /gate; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE$path" || echo 000)
  printf '  %s  %s\n' "$code" "$path"
done

cat <<EOF

Rollback, if that looks wrong:
  sudo rm -rf $WEB_ROOT.bad && sudo mv $WEB_ROOT $WEB_ROOT.bad && sudo mv $WEB_ROOT.old $WEB_ROOT
EOF
