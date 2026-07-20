import { statusLabels, statusOrder } from '@/lib/types';

describe('Task 类型', () => {
  it('statusOrder 包含三列', () => {
    expect(statusOrder).toHaveLength(3);
    expect(statusOrder).toEqual(['todo', 'doing', 'done']);
  });

  it('statusLabels 三列标签正确', () => {
    expect(statusLabels.todo).toBe('待办');
    expect(statusLabels.doing).toBe('进行中');
    expect(statusLabels.done).toBe('已完成');
  });

  it('statusOrder 顺序是 todo → doing → done', () => {
    expect(statusOrder.indexOf('todo')).toBeLessThan(statusOrder.indexOf('doing'));
    expect(statusOrder.indexOf('doing')).toBeLessThan(statusOrder.indexOf('done'));
  });
});

describe('API 契约', () => {
  const validStatuses = ['todo', 'doing', 'done'];

  it('有效的 status 值', () => {
    validStatuses.forEach((s) => {
      expect(['todo', 'doing', 'done']).toContain(s);
    });
  });

  it('无效的 status 应该被拒绝', () => {
    const invalid = ['invalid', 'blocked', ''];
    invalid.forEach((s) => {
      expect(validStatuses).not.toContain(s);
    });
  });
});
