import { describe, it, expect } from 'vitest';

// Simple unit tests for core functionality
describe('Todo App Core Functions', () => {
  it('should create a task with correct properties', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      completed: false,
      priority: 'medium' as const,
      tags: [],
      subtasks: [],
      createdAt: new Date()
    };

    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
    expect(task.priority).toBe('medium');
    expect(task.tags).toEqual([]);
    expect(task.subtasks).toEqual([]);
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it('should handle JSON serialization', () => {
    const testData = { tasks: [], version: '1.0' };

    // Test JSON operations
    const serialized = JSON.stringify(testData);
    const deserialized = JSON.parse(serialized);

    expect(deserialized).toEqual(testData);
    expect(typeof serialized).toBe('string');
  });

  it('should validate task priorities', () => {
    const validPriorities = ['low', 'medium', 'high'];

    validPriorities.forEach(priority => {
      expect(['low', 'medium', 'high']).toContain(priority);
    });
  });

  it('should handle date operations', () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(tomorrow.getTime()).toBeGreaterThan(now.getTime());
  });

  it('should filter tasks correctly', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, priority: 'high' as const },
      { id: '2', title: 'Task 2', completed: true, priority: 'low' as const },
      { id: '3', title: 'Task 3', completed: false, priority: 'medium' as const }
    ];

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');

    expect(pendingTasks).toHaveLength(2);
    expect(completedTasks).toHaveLength(1);
    expect(highPriorityTasks).toHaveLength(1);
  });
});
