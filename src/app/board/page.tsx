'use client';

import { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { statusLabels, statusOrder } from '@/lib/types';

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks').then((r) => r.json()).then(setTasks).finally(() => setLoading(false));
  }, []);

  const moveTask = async (id: number, newStatus: TaskStatus) => {
    const res = await fetch(`/api/tasks?id=${id}&status=${newStatus}`, { method: 'PATCH' });
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus, done: newStatus === 'done' } : t))
      );
    }
  };

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  if (loading) return <p className="text-gray-500 p-6">加载看板...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">看板视图</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusOrder.map((status) => {
          const columnTasks = tasksByStatus(status);
          const prevStatus = statusOrder[statusOrder.indexOf(status) - 1] as TaskStatus | undefined;
          const nextStatus = statusOrder[statusOrder.indexOf(status) + 1] as TaskStatus | undefined;

          return (
            <div key={status} className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-700">{statusLabels[status]}</h2>
                <span className="text-sm text-gray-400">{columnTasks.length}</span>
              </div>
              {columnTasks.length === 0 ? (
                <p className="text-gray-300 text-sm text-center py-8">暂无任务</p>
              ) : (
                <ul className="space-y-2">
                  {columnTasks.map((task) => (
                    <li key={task.id} className="bg-white p-3 rounded border shadow-sm">
                      <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
                      <div className="flex gap-1">
                        {prevStatus && (
                          <button
                            onClick={() => moveTask(task.id, prevStatus)}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                          >
                            ← {statusLabels[prevStatus]}
                          </button>
                        )}
                        {nextStatus && (
                          <button
                            onClick={() => moveTask(task.id, nextStatus)}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 ml-auto"
                          >
                            {statusLabels[nextStatus]} →
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
