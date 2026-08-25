#!/usr/bin/env bash
#
# Back up the Manourying database.
#
#   ./deploy/backup-db.sh
#
# This is not optional housekeeping. The seat ledger, the lineage tree and the
# Echo consent decisions are the only irreplaceable artefacts in the whole
# system — a lost seat table means every participant's invite chain is gone and
# there is no way to reconstruct who invited whom. Everything else here (the
# site, the API, the panel) can be rebuilt from git in minutes.
#
# Install as a timer:
#   sudo cp deploy/systemd/manourying-backup.* /etc/systemd/system/
#   sudo systemctl enable --now manourying-backup.timer
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/srv/manourying/backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
DB="${DB:-manourying}"

cd "$(dirname "$0")/.."

stamp=$(date -u +%Y%m%dT%H%M%SZ)
target="$BACKUP_DIR/$DB-$stamp.dump"

# Owned by postgres, not root: pg_dump runs AS postgres and writes the file
# itself, so a root-owned 700 directory fails with a bare "Permission denied"
# that looks like a sudo problem and is not.
sudo mkdir -p "$BACKUP_DIR"
sudo chown postgres:postgres "$BACKUP_DIR"
sudo chmod 700 "$BACKUP_DIR"

# -Fc is the custom format: compressed, and restorable selectively with
# pg_restore rather than only as an all-or-nothing psql replay.
sudo -u postgres pg_dump -Fc "$DB" -f "$target"
sudo chmod 600 "$target"

echo "wrote $target ($(sudo du -h "$target" | cut -f1))"

# A backup that has never been restored is a hypothesis, not a backup. Verify
# the dump is at least structurally readable before trusting it.
if ! sudo -u postgres pg_restore --list "$target" >/dev/null 2>&1; then
  echo "the dump just written is not readable by pg_restore — investigate now" >&2
  exit 1
fi

deleted=$(sudo find "$BACKUP_DIR" -name "$DB-*.dump" -mtime "+$KEEP_DAYS" -print -delete | wc -l)
echo "pruned $deleted backup(s) older than $KEEP_DAYS days"

cat <<EOF

Restore into a scratch database to rehearse (do this at least once):
  sudo -u postgres createdb ${DB}_restore_check
  sudo -u postgres pg_restore -d ${DB}_restore_check "$target"
  sudo -u postgres psql -d ${DB}_restore_check -c 'SELECT count(*) FROM seats;'
  sudo -u postgres dropdb ${DB}_restore_check
EOF
