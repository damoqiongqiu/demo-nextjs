#!/usr/bin/env bash
set -euo pipefail
echo "=== L3 E2E ==="
PASS=0 FAIL=0
pass() { PASS=$((PASS+1)); }
fail() { FAIL=$((FAIL+1)); echo "  [FAIL] $1 — $2"; }

# Start server
pkill -f "next dev" 2>/dev/null || true; sleep 1
PORT=3500; NODE_OPTIONS= npx next dev -p $PORT &>/tmp/njs-l3.log & PID=$!
for i in $(seq 1 10); do sleep 2; curl -s http://localhost:$PORT 2>/dev/null | grep -q 'demo' && break; done

echo "1. 页面渲染:"
curl -s http://localhost:$PORT | grep -q 'demo-nextjs' && pass "首页" || fail "首页" "无内容"
curl -s http://localhost:$PORT/tasks | grep -q '任务管理' && pass "任务页" || fail "任务页" "无内容"
curl -s http://localhost:$PORT/board | grep -q '看板' && pass "看板页" || fail "看板页" "无内容"

echo "2. API 流程:"
R=$(curl -s -X POST http://localhost:$PORT/api/tasks -H "Content-Type: application/json" -d '{"title":"E2E task"}')
echo "$R" | grep -q '"id"' && pass "创建" || fail "创建" "失败"
ID=$(echo "$R" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null)
curl -s -X PATCH "http://localhost:$PORT/api/tasks?id=$ID&status=done" | grep -q '"done":true' && pass "完成" || fail "完成" "失败"
curl -s -X DELETE "http://localhost:$PORT/api/tasks?id=$ID" | grep -q '"ok"' && pass "删除" || fail "删除" "失败"

kill $PID 2>/dev/null; wait $PID 2>/dev/null || true
echo "结果: PASS=$PASS  FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && { echo "结论: FAIL"; exit 1; }
echo "结论: PASS"
