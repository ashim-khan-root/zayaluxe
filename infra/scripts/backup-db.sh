#!/usr/bin/env bash
# Nightly Postgres backup → encrypted file (architecture.md §13).
#
# Retention: 30 daily / 12 weekly / 12 monthly. Upload to R2 after this script succeeds.
# A backup is not "done" until a restore has been tested — see restore-db.sh.
#
# Usage: ./backup-db.sh [/path/to/output-dir]
set -euo pipefail

OUT_DIR="${1:-./backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="${OUT_DIR}/zayaluxe-${STAMP}.sql.gz"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

: "${POSTGRES_USER:?set POSTGRES_USER}"
: "${POSTGRES_DB:?set POSTGRES_DB}"
: "${BACKUP_ENCRYPTION_KEY:?set BACKUP_ENCRYPTION_KEY (age or gpg recipient)}"

mkdir -p "$OUT_DIR"

echo "→ dumping ${POSTGRES_DB}"
docker compose -f "$(dirname "$0")/../docker-compose.prod.yml" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --clean --if-exists \
  | gzip -9 > "$FILE"

# Fail loudly on an empty or suspiciously small dump rather than rotating good backups out.
SIZE="$(wc -c < "$FILE")"
if [ "$SIZE" -lt 1024 ]; then
  echo "✗ dump is ${SIZE} bytes — refusing to keep it" >&2
  rm -f "$FILE"
  exit 1
fi

echo "→ encrypting"
age -r "$BACKUP_ENCRYPTION_KEY" -o "${FILE}.age" "$FILE"
rm -f "$FILE"

echo "✓ ${FILE}.age ($(wc -c < "${FILE}.age") bytes)"

find "$OUT_DIR" -name 'zayaluxe-*.sql.gz.age' -mtime "+${RETENTION_DAYS}" -print -delete

# TODO(Phase 5): rclone copy to R2 + verify object exists, then alert on failure.
