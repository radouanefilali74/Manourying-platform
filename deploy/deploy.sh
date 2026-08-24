#!/usr/bin/env bash
#
# Deploy the static site to the VPS *from a remote workstation*.
#
# If you are already on the VPS — which is where the repo normally lives — use
# ./deploy/publish.sh instead. This script would ssh to the machine it is
# running on. It also assumes Caddy owns the document root; the box now runs
# nginx (see DEPLOY.md), so the ownership it sets is wrong there.
#
# Builds locally, ships a tarball, and swaps it into place atomically — the
# live directory is replaced by a `mv`, so a visitor never sees a half-copied
# site and a failed transfer leaves the current one untouched.
#
# Uses tar over scp rather than rsync, because Git Bash on Windows has no
# rsync and installing one just for this is not worth it.
#
#   ./deploy/deploy.sh
#
# Override anything via the environment:
#   VPS=ubuntu@1.2.3.4 SSH_KEY=~/.ssh/other ./deploy/deploy.sh
set -euo pipefail

VPS="${VPS:-ubuntu@158.69.219.65}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/vps_85}"
REMOTE_ROOT="${REMOTE_ROOT:-/srv/manourying/web}"

cd "$(dirname "$0")/.."

ssh_opts=(-o StrictHostKeyChecking=accept-new)
[ -f "$SSH_KEY" ] && ssh_opts+=(-i "$SSH_KEY")

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/4  Verifying before building"
# The parity gate is not optional here: this deploy publishes the seal hash,
# and publishing one that disagrees with the app is worse than not publishing.
node scripts/check-parity.mjs ../manourying

say "2/4  Building"
npm --prefix web run build

if [ ! -f web/dist/what-this-is.html ]; then
  echo "web/dist looks wrong — the explainer page is missing. Refusing to deploy." >&2
  exit 1
fi

say "3/4  Shipping to $VPS"
stamp="$(date +%Y%m%d%H%M%S)"
tarball="manourying-web-$stamp.tar.gz"
tar -C web/dist -czf "/tmp/$tarball" .
scp "${ssh_opts[@]}" "/tmp/$tarball" "$VPS:/tmp/$tarball"
rm -f "/tmp/$tarball"

say "4/4  Swapping into place"
ssh "${ssh_opts[@]}" "$VPS" bash -se <<EOF
set -euo pipefail
root="$REMOTE_ROOT"
tarball="/tmp/$tarball"

sudo rm -rf "\$root.new"
sudo mkdir -p "\$root.new"
sudo tar -C "\$root.new" -xzf "\$tarball"
rm -f "\$tarball"

# Caddy reads these as its own user.
sudo chown -R caddy:caddy "\$root.new" 2>/dev/null || true
sudo chmod -R a+rX "\$root.new"

# Atomic-ish swap. The previous release is kept as .old so a bad deploy can be
# undone with a single mv rather than a rebuild.
sudo rm -rf "\$root.old"
if [ -d "\$root" ]; then sudo mv "\$root" "\$root.old"; fi
sudo mv "\$root.new" "\$root"

echo "deployed \$(find "\$root" -type f | wc -l) files"
EOF

say "Done. Checking the live site…"
for path in / /what-this-is /directive /gate; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://manourying.manouri.ovh$path" || echo 000)
  printf '  %s  %s\n' "$code" "$path"
done
