#!/usr/bin/env bash
# Post-deploy smoke test — the four critical paths (architecture.md §12).
#
# Run after every staging deploy and every production deploy. Exit code drives the
# rollback decision: any failure here means roll back, do not "watch and see".
#
# Usage: ./smoke.sh https://staging.zayaluxe.co
set -euo pipefail

BASE="${1:?usage: smoke.sh <base-url>}"
API="${API_URL:-${BASE/api./api.}}"

fail=0

check() {
  local name="$1" url="$2" expect="$3"
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$url" || echo 000)"
  if [ "$code" = "$expect" ]; then
    echo "✓ ${name} (${code})"
  else
    echo "✗ ${name} — expected ${expect}, got ${code} — ${url}" >&2
    fail=1
  fi
}

check "home (en)"        "${BASE}/en"                       200
check "home (ar)"        "${BASE}/ar"                       200
check "health (api)"     "${API}/health"                    200
check "regions (api)"    "${API}/store/regions"             200

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "SMOKE FAILED — roll back. Runbook: docs/runbooks/rollback.md" >&2
  exit 1
fi

echo ""
echo "Smoke passed. Watch error rate and p95 for 15 minutes."
