#!/usr/bin/env bash
set -euo pipefail
echo "=== L4 安全 ==="
PASS=0 FAIL=0
pass() { PASS=$((PASS+1)); }
fail() { FAIL=$((FAIL+1)); echo "  [FAIL] $1 — $2"; }
grep -rni 'password\s*=\|api_key\s*=\|sk-[a-zA-Z0-9]' src/ --include="*.ts" --include="*.tsx" | grep -v 'env\|process\.env\|ENV' && fail "硬编码" "有敏感信息" || pass "无硬编码"
echo "结果: PASS=$PASS  FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && { echo "结论: FAIL"; exit 1; }
echo "结论: PASS"
