# 任务管理 — 技术 Spec

**关联**: specs/task-manager/product.md  
**创建**: 2026-07-19

## 架构
`src/app/api/tasks/route.ts` (Next.js Route Handler) → 内存数组

## 端点
| 方法 | 参数 | 返回 |
|------|------|------|
| GET | ?q=&status= | Task[] |
| POST | {title, status?} | Task \| 400 |
| PATCH | ?id=&status= | Task \| 404 |
| DELETE | ?id= | {ok: true} |

## 已知局限
- 无持久化存储，服务重启丢失
- 无分页
