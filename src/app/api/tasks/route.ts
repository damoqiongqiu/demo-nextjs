import { NextResponse } from 'next/server';
import type { Task, TaskStatus } from '@/lib/types';

const VALID_STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

let tasks: Task[] = [
  { id: 1, title: '完成 Next.js 示例项目集成', done: false, status: 'doing', updatedAt: new Date().toISOString() },
  { id: 2, title: '验证 harness 全流程', done: false, status: 'todo', updatedAt: new Date().toISOString() },
  { id: 3, title: '实现看板视图', done: false, status: 'done', updatedAt: new Date().toISOString() },
];

const nextId = () => Math.max(0, ...tasks.map((t) => t.id)) + 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const status = searchParams.get('status') as TaskStatus | null;

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `invalid status: ${status}` }, { status: 400 });
  }

  let filtered = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)) : tasks;
  if (status) filtered = filtered.filter((t) => t.status === status);

  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = body.title;
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const rawStatus = body.status;
  const status: TaskStatus = VALID_STATUSES.includes(rawStatus) ? rawStatus : 'todo';
  const task: Task = { id: nextId(), title, done: status === 'done', status, updatedAt: new Date().toISOString() };
  tasks.push(task);
  return NextResponse.json(task, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '0', 10);
  tasks = tasks.filter((t) => t.id !== id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '0', 10);
  const task = tasks.find((t) => t.id === id);
  if (!task) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const newStatus = searchParams.get('status') as TaskStatus | null;
  if (newStatus && VALID_STATUSES.includes(newStatus)) {
    task.status = newStatus;
    task.done = newStatus === 'done';
    task.updatedAt = new Date().toISOString();
  } else {
    // 兼容旧 toggle 行为
    task.done = !task.done;
    task.status = task.done ? 'done' : 'todo';
    task.updatedAt = new Date().toISOString();
  }
  return NextResponse.json(task);
}
