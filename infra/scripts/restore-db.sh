#!/usr/bin/env bash
# Restore a backup into a target database. Defaults to a staging database, NOT production.
#
# The restore is only successful when the storefront serves a product against the restored
# data (architecture.md §13). A restore that "completes" but serves an empty catalogue is a
# failed restore.
#
# Usage: ./restore-db.sh <backup.sql.gz.age> [target-db]
set -euo pipefail

BACKUP="${1:?usage: restore-db.sh <backup.sql.gz.age> [target-db]}"
TARGET_DB="${2:-zayaluxe_restore_test}"

: "${POSTGRES_USER:?set POSTGRES_USER}"
: "${BACKUP_ENCRYPTION_KEY:?set BACKUP_ENCRYPTION_KEY}"

if [ "${TARGET_DB}" = "${POSTGRES_DB:-}" ] && [ "${ALLOW_PRODUCTION_RESTORE:-}" != "yes-i-mean-it" ]; then
  echo "✗ refusing to restore over POSTGRES_DB without ALLOW_PRODUCTION_RESTORE=yes-i-mean-it" >&2
  exit 1
fi

echo "→ decrypting"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
age -d -i "$BACKUP_ENCRYPTION_KEY" -o "${TMP}/dump.sql.gz" "$BACKUP"
gunzip -f "${TMP}/dump.sql.gz"

echo "→ recreating ${TARGET_DB}"
docker compose -f "$(dirname "$0")/../docker-compose.prod.yml" exec -T postgres \
  psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS ${TARGET_DB};"
docker compose -f "$(dirname "$0")/../docker-compose.prod.yml" exec -T postgres \
  psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE ${TARGET_DB};"

echo "→ loading"
docker compose -f "$(dirname "$0")/../docker-compose.prod.yml" exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$TARGET_DB" < "${TMP}/dump.sql"

echo "✓ restore loaded into ${TARGET_DB}"
echo "  next: point a staging backend at it and confirm a product page renders."
echo "  record the timing in the Phase 5 DR drill evidence."
