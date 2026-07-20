# 看板视图 — 产品 Spec

**状态**: ✅ 已交付  
**创建**: 2026-07-19  
**关联 exec-plan**: docs/exec-plans/completed/kanban-board.md（harness 项目内）

## 1. 用户故事

作为用户，我希望在任务列表之外有一个看板视图，将任务按状态（待办 / 进行中 / 已完成）分列展示，以便直观了解项目进度。

## 2. 功能描述

### 2.1 数据模型变更

Task 类型增加字段：
- `status`: `"todo"` | `"doing"` | `"done"`（默认 `"todo"`）
- `updatedAt`: ISO 字符串（每次状态变更更新）

现有 `done: boolean` 字段保留兼容（只读，与 status 自动同步）。

### 2.2 API 变更

| 端点 | 变更 |
|------|------|
| `GET /api/tasks` | 新增 `?status=todo|doing|done` 可选筛选 |
| `PATCH /api/tasks?id=` | status 参数支持 `?status=...` 批量更新；保留 toggle 兼容 |
| `POST /api/tasks` | 新增 `status` 可选字段（默认 todo） |

### 2.3 看板页面 `/board`

- 三列布局：待办 / 进行中 / 已完成（响应式 grid，移动端纵向排列）
- 每列显示任务卡片（标题 + ← → 状态切换按钮）
- 空列显示「暂无任务」提示
- 首页增加看板入口（与列表视图并排）

## 3. 非功能需求

- 首次加载 < 2s
- API 幂等（状态重复切换不丢数据）

## 4. 边界场景

| 场景 | 预期行为 |
|------|---------|
| 空看板 | 三列均显示「暂无任务」 |
| `?status=invalid` | API 返回 400 + error 消息 |
| PATCH 不存在的 id | 返回 404 |
| 页面 JS 被禁用 | 看板不渲染（CSR 页面） |

## 5. 验收标准

- [x] `GET /api/tasks?status=doing` 返回正确筛选结果
- [x] `PATCH /api/tasks?id=1&status=done` 成功更新
- [x] `/board` 页面三列渲染，切换按钮正常
- [x] L1 冒烟 6/6 + L2 单元 5 端点 + L3 E2E 全流程通过
- [x] 构建成功（4 条路由 + `/board`）
