'use client';

import { useState, useEffect } from 'react';

interface Task { id: number; title: string; done: boolean }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = search ? `/api/tasks?q=${encodeURIComponent(search)}` : '/api/tasks';
    fetch(url).then((r) => r.json()).then(setTasks).finally(() => setLoading(false));
  }, [search]);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    });
    if (res.ok) { const task = await res.json(); setTasks((p) => [...p, task]); setTitle(''); }
  };

  const toggleTask = async (id: number) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'PATCH' });
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    setTasks((p) => p.filter((t) => t.id !== id));
  };

  if (loading) return <p className="text-gray-500">加载中...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">任务管理</h1>

      <div className="flex gap-2 mb-3">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()} placeholder="新任务..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
        <button onClick={addTask} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">添加</button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索任务..." className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none text-black" />

      {tasks.length === 0 && <p className="text-gray-400">{search ? '无匹配任务' : '暂无任务'}</p>}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="w-5 h-5" />
              <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800'}>{task.title}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
