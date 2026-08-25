#!/usr/bin/env bash
#
# Publish the API — run this ON the VPS, where the repo lives.
#
#   ./deploy/publish-api.sh
#
# There is no blue/green rig here and there should not be one. This API serves
# an admin panel used by a handful of people; being unreachable for two seconds
# during a deploy is not a problem worth solving twice over. Saying so in the
# script is cheaper than someone building one later.
set -euo pipefail

UNIT="${UNIT:-manourying-api}"
HEALTH="${HEALTH:-http://127.0.0.1:8080/healthz}"

cd "$(dirname "$0")/.."

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/6  Verify gate"
# Covers web, server and admin. The parity leg is in here, which is why this
# runs before anything is built or restarted.
npm run verify

say "2/6  Tests"
# These skip themselves unless DATABASE_URL names a *_test database, which is
# exactly why they are NOT in `npm run verify` — a gate that can silently skip
# is not a gate. Here, on the machine that publishes, the database exists.
if [ -f server/.env.test ]; then
  npm --prefix server test
else
  echo "server/.env.test not found — skipping tests." >&2
  echo "Create a throwaway database and point .env.test at it; see db/README.md." >&2
fi

say "3/6  Building"
# Dev dependencies are needed here — tsc is one of them. Do not "optimise" this
# to `--omit=dev`: the build would fail with `tsc: not found`, and pruning after
# the build buys nothing, since nothing at runtime reads node_modules for types.
npm --prefix server ci
npm --prefix server run build

# The what-this-is.html analogue: if the build rearranged itself, find out here
# rather than from a 502 on the live hostname.
if [ ! -f server/dist/index.js ]; then
  echo "server/dist looks wrong — dist/index.js is missing. Refusing to publish." >&2
  exit 1
fi

say "4/6  Migrations"
# A migration applies seconds before the restart, so it must be compatible with
# the code that is STILL RUNNING. Additive changes only in the same release as
# a deploy; anything destructive is a separate, later release.
npm --prefix server run db:migrate

say "5/6  Restarting $UNIT"
sudo systemctl restart "$UNIT"

say "6/6  Health"
for attempt in $(seq 1 30); do
  if curl -sf --max-time 3 "$HEALTH" >/dev/null 2>&1; then
    echo "healthy after ${attempt}s: $(curl -s --max-time 3 "$HEALTH")"
    exit 0
  fi
  sleep 1
done

echo "" >&2
echo "$UNIT did not become healthy within 30s. Last 50 log lines:" >&2
sudo journalctl -u "$UNIT" -n 50 --no-pager >&2
echo "" >&2
echo "Roll back with:  sudo systemctl stop $UNIT  (the previous dist is in git)" >&2
exit 1
