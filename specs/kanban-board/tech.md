# 看板视图 — 技术 Spec

**关联**: specs/kanban-board/product.md  
**创建**: 2026-07-19  
**技术栈**: Next.js 14 App Router + TypeScript + Tailwind CSS

## 1. 路由设计

```
/                      首页（列表 + 看板入口）
/tasks                 任务列表视图
/board                 看板视图（本 feature）
/api/tasks             CRUD + status filter
```

## 2. 数据流

```
src/lib/types.ts                    # Task / TaskStatus 类型定义
  ↓
src/app/api/tasks/route.ts          # 内存 API（GET/POST/PATCH/DELETE）
  ↓
src/app/board/page.tsx              # 看板页面（CSR，useEffect fetch）
```

## 3. 状态管理

- 纯客户端状态：`useState<Task[]>` + `fetch` 驱动
- 无全局 store，不引入状态管理库
- 状态切换：按钮触发 `PATCH` → 客户端乐观更新

## 4. 测试策略

| 层级 | 内容 | 文件 |
|------|------|------|
| Jest | 类型定义 + status 契约 | `src/__tests__/types.test.ts` |
| L1 | tsc + eslint + jest | `l1-health-check.sh` |
| L2 | API 契约（GET/POST/PATCH/DELETE + 校验） | `l2-integration.sh` |
| L3 | 页面渲染 + API 全流程 | `tests/scenarios/l3-e2e/run-l3-e2e.sh` |

## 5. 已知局限

- 内存存储，服务重启后数据重置
- 看板不兼容 JS 禁用环境（CSR 渲染）
- task 模型 done 字段保留但已冗余（status.done === done）
