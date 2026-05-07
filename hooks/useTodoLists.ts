import { useAppSelector } from '@/store/hooks';
import type { Role } from '@/types';

export function useTodoLists() {
  return useAppSelector(state => state.todoLists);
}

export function useSelectedList() {
  return useAppSelector(state => {
    const { lists, selectedListId } = state.todoLists;
    return lists.find(l => String(l.id) === selectedListId) ?? null;
  });
}

export function useCurrentUserRole(): Role {
  return useAppSelector(state => {
    const { lists, selectedListId } = state.todoLists;
    if (!selectedListId) return 'viewer';
    const list = lists.find(li => String(li.id) === selectedListId);
    if (!list) return 'viewer';
    return list.members?.[0]?.role ?? 'viewer';
  });
}