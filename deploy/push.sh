#!/usr/bin/env bash
#
# Commit the working tree and push it to GitHub — run this ON the VPS, where
# the repo lives.
#
#   ./deploy/push.sh "feat: what changed"
#
# The verify gate runs first and a failure aborts before anything is committed,
# so a broken tree never reaches origin. That gate is the whole reason this
# script exists rather than a bare `git push`: this repo publishes a hash that
# has to agree with the app repo, and `npm run verify` is what proves it still
# does.
#
# Override anything via the environment:
#   REMOTE=upstream BRANCH=main ./deploy/push.sh "fix: ..."
#   SKIP_VERIFY=1 ./deploy/push.sh "docs: typo"   # deploy/ and *.md only
set -euo pipefail

REMOTE="${REMOTE:-origin}"

cd "$(dirname "$0")/.."

BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

MESSAGE="${1:-}"
if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"commit message\"" >&2
  echo "No message given — refusing to invent one." >&2
  exit 1
fi

say "1/4  What is about to be committed"
git add -A
if git diff --cached --quiet; then
  echo "Nothing staged — the working tree already matches HEAD."
  echo "Pushing whatever commits are ahead of $REMOTE/$BRANCH instead."
else
  git diff --cached --stat
fi

say "2/4  Verify gate"
# Not optional. The site publishes the seal hash computed from its own copy of
# the directive; if that has drifted from the app repo, the commit is a lie and
# is better caught here than by a participant.
if [ -n "${SKIP_VERIFY:-}" ]; then
  echo "SKIPPED — SKIP_VERIFY is set. Only sound for deploy/ and *.md changes."
else
  npm run verify
fi

say "3/4  Committing"
if git diff --cached --quiet; then
  echo "(nothing new to commit)"
else
  git commit -m "$MESSAGE"
fi

say "4/4  Pushing to $REMOTE/$BRANCH"
# -u so a branch created here tracks its remote from the first push onward.
git push -u "$REMOTE" "$BRANCH"

cat <<EOF

Pushed $(git rev-parse --short HEAD) to $(git remote get-url "$REMOTE")

Undo the commit but keep the changes (before anyone else pulls):
  git reset --soft HEAD~1 && git push --force-with-lease $REMOTE $BRANCH
EOF
