# demo-nextjs

**这是一个测试项目，用于验证 [my-harness-flow](https://github.com/damoqiongqiu/my-harness-flow) 框架的各项能力，没有任何实际业务功能。**

## 用途

- 安装 harness `--profile web` 后验证 start-task / quality-gate / finish-task 全流程
- 测试 GitHub + GitLab 双平台 create-issue / create-pr / CI Pipeline
- 验证 session-start / diagnose / git-worktree / spec-driven-implementation 等技能
- L5 回归（L1 冒烟 → L2 单元 → L3 E2E → L4 安全 → L5 全量）

## 运行

```bash
npm run dev      # http://localhost:3000
npm run build    # 生产构建
bash l1-health-check.sh       # L1 冒烟
bash tests/scenarios/l5-regression/run-l5-regression.sh  # L5 全量
```

## 目录

```
src/app/api/tasks/  → 任务 CRUD API（GET/POST/PATCH/DELETE + 搜索 + 状态筛选）
src/app/tasks/      → 任务列表页面（添加 / 完成 / 删除 / 搜索）
src/app/board/      → 看板视图（三列状态切换）
src/__tests__/      → Jest 单元测试
specs/              → kanban-board + task-manager 产品/技术 spec
docs/exec-plans/    → 活跃任务进度
docs/work-journal/  → 每日工作日志
```
