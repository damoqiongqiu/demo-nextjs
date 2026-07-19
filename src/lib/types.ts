export interface Task {
  id: number;
  title: string;
  done: boolean;       // 保留兼容
  status: 'todo' | 'doing' | 'done';
  updatedAt: string;
}

export type TaskStatus = Task['status'];

export const statusLabels: Record<TaskStatus, string> = {
  todo: '待办',
  doing: '进行中',
  done: '已完成',
};

export const statusOrder: TaskStatus[] = ['todo', 'doing', 'done'];
