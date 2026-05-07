import { useAppSelector } from '@/store/hooks';
import type { Role } from '@/types';

export function useTodoLists() {
  return useAppSelector(state => state.todoLists);
}

export function useSelectedList() {
  return useAppSelector(state => {
    const { lists, selectedListId } = state.todoLists;
    return lists.find(l => l.id === selectedListId) ?? null;
  });
}

export function useCurrentUserRole(): Role {
  return useAppSelector(state => {
    const { lists, selectedListId } = state.todoLists;
    const userId = state.auth.user?.id;
    if (!userId || !selectedListId) return 'viewer';
    const list = lists.find(l => l.id === selectedListId);
    if (!list) return 'viewer';
    const member = list.members.find(m => m.userId === userId);
    return member?.role ?? 'viewer';
  });
}