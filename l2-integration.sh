#!/usr/bin/env bash
set -euo pipefail
PASS=0 FAIL=0
pass() { PASS=$((PASS+1)); }
fail() { FAIL=$((FAIL+1)); echo "  [FAIL] $1 — $2"; }
echo "=== L2 前端单元测试 ==="
echo "--- API 契约 ---"
pkill -f "next dev" 2>/dev/null || true; sleep 1
PORT=3470; NODE_OPTIONS= npx next dev -p $PORT &>/tmp/njs-l2.log & PID=$!
for i in $(seq 1 10); do sleep 2; curl -s http://localhost:$PORT/api/tasks 2>/dev/null | grep -q 'id' && break; done
curl -s http://localhost:$PORT/api/tasks | grep -q '"id"' && pass "GET /api/tasks" || fail "GET /api/tasks" "无响应"
R=$(curl -s -X POST http://localhost:$PORT/api/tasks -H "Content-Type: application/json" -d '{"title":"L2 test"}')
echo "$R" | grep -q '"id"' && pass "POST /api/tasks" || fail "POST /api/tasks" "创建失败"
curl -s -X POST http://localhost:$PORT/api/tasks -H "Content-Type: application/json" -d '{}' | grep -q '"error"' && pass "POST 参数校验" || fail "POST 参数校验" "缺校验"
ID=$(echo "$R" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])" 2>/dev/null || echo 0)
curl -s -X DELETE "http://localhost:$PORT/api/tasks?id=$ID" | grep -q '"ok"' && pass "DELETE /api/tasks" || fail "DELETE /api/tasks" "删除失败"
kill $PID 2>/dev/null; wait $PID 2>/dev/null || true
total=$((PASS + FAIL)); rate=$((PASS * 100 / total))
echo "结果: PASS=$PASS  FAIL=$FAIL  通过率=${rate}%"
[ "$rate" -ge 90 ] && { echo "结论: PASS"; exit 0; }
echo "结论: FAIL"; exit 1

# ── 新增：PATCH + 搜索测试 ──
echo ""
echo "--- 扩展 API 测试 ---"
pkill -f "next dev" 2>/dev/null || true; sleep 1
PORT=3475; NODE_OPTIONS= npx next dev -p $PORT &>/tmp/njs-l2.log & PID=$!
for i in $(seq 1 10); do sleep 2; curl -s http://localhost:$PORT/api/tasks 2>/dev/null | grep -q 'id' && break; done

# PATCH toggle
TASK=$(curl -s http://localhost:$PORT/api/tasks | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
BEFORE=$(curl -s http://localhost:$PORT/api/tasks | python3 -c "import sys,json;t=json.load(sys.stdin)[0];print(t['done'])" 2>/dev/null)
curl -s -X PATCH "http://localhost:$PORT/api/tasks?id=$TASK" >/dev/null
AFTER=$(curl -s http://localhost:$PORT/api/tasks | python3 -c "import sys,json;t=json.load(sys.stdin)[0];print(t['done'])" 2>/dev/null)
[ "$BEFORE" != "$AFTER" ] && pass "PATCH toggle" || fail "PATCH toggle" "未切换状态"

# 404 test
curl -s -X PATCH "http://localhost:$PORT/api/tasks?id=99999" | grep -q '"not found"\|404\|error' && pass "PATCH 404" || fail "PATCH 404" "缺404处理"

# Search
curl -s -X POST http://localhost:$PORT/api/tasks -H "Content-Type: application/json" -d '{"title":"特殊搜索词XYZ"}' >/dev/null
curl -s "http://localhost:$PORT/api/tasks?q=XYZ" | grep -q 'XYZ' && pass "GET search" || fail "GET search" "搜索无效"
curl -s "http://localhost:$PORT/api/tasks?q=NOSUCHWORD" | grep -q '\[\]' && pass "GET search 空结果" || fail "GET search 空结果" "空搜索"

kill $PID 2>/dev/null; wait $PID 2>/dev/null || true
