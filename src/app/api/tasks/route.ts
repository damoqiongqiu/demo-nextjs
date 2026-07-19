import { NextResponse } from 'next/server';

let tasks: { id: number; title: string; done: boolean }[] = [
  { id: 1, title: '完成 Next.js 示例项目集成', done: false },
  { id: 2, title: '验证 harness 全流程', done: false },
];

const nextId = () => Math.max(0, ...tasks.map((t) => t.id)) + 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const filtered = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)) : tasks;
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const task = { id: nextId(), title, done: false };
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
  task.done = !task.done;
  return NextResponse.json(task);
}
