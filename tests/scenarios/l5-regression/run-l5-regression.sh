#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PASS=0 FAIL=0
run() { local label="$1" script="$2"; echo "=== $label ==="; bash "$ROOT/$script" && { PASS=$((PASS+1)); echo "  ✅ $label"; } || { FAIL=$((FAIL+1)); echo "  ❌ $label"; }; echo ""; }
run "L1 冒烟" "l1-health-check.sh"
run "L2 单元" "l2-integration.sh"
run "L3 E2E"  "tests/scenarios/l3-e2e/run-l3-e2e.sh"
run "L4 安全" "tests/scenarios/l4-security/run-l4-security.sh"
echo "PASS=$PASS  FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && { echo "结论: FAIL"; exit 1; }
echo "结论: PASS"
