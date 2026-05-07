import type { CreateListPayload, TodoList, UpdateListPayload } from '@/types';
import api from './api/axios';

export async function getListsService(_token: string): Promise<TodoList[]> {
  const { data } = await api.get<TodoList[]>('/lists');
  return data;
}

export async function createListService(_token: string, payload: CreateListPayload): Promise<TodoList> {
  const { data } = await api.post<TodoList>('/lists', payload);
  return data;
}

export async function updateListService(_token: string, payload: UpdateListPayload): Promise<TodoList> {
  const { data } = await api.put<TodoList>(`/lists/${payload.id}`, { name: payload.name });
  return data;
}

export async function deleteListService(_token: string, listId: string): Promise<void> {
  await api.delete(`/lists/${listId}`);
}