import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { TaskFilter } from '@/types';

export function useTasks(listId: string | null) {
  const tasks = useAppSelector(state =>
    listId ? (state.tasks.tasksByListId[listId] ?? []) : []
  );
  return tasks;
}

export function useFilteredTasks(listId: string | null, filter: TaskFilter) {
  const tasks = useTasks(listId);
  return useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => filter === 'completed' ? t.isDone : !t.isDone);
  }, [tasks, filter]);
}

export function useTasksState() {
  return useAppSelector(state => ({
    loading: state.tasks.loading,
    submitting: state.tasks.submitting,
    error: state.tasks.error,
  }));
}