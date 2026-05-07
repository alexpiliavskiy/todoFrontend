import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/types';
import api from './api/axios';

export async function getTasksService(_token: string, listId: string): Promise<Task[]> {
  const { data } = await api.get<Task[]>(`/lists/${listId}/tasks`);
  return data;
}

export async function createTaskService(_token: string, payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>(`/lists/${payload.listId}/tasks`, {
    title: payload.title,
    description: payload.description,
  });
  return data;
}

export async function updateTaskService(_token: string, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.put<Task>(`/lists/${payload.listId}/tasks/${payload.id}`, {
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && { description: payload.description }),
  });
  return data;
}

export async function deleteTaskService(_token: string, listId: string, taskId: string): Promise<void> {
  await api.delete(`/lists/${listId}/tasks/${taskId}`);
}

export async function toggleTaskService(_token: string, listId: string, taskId: string): Promise<Task> {
  const { data } = await api.patch<Task>(`/lists/${listId}/tasks/${taskId}/toggle`);
  return data;
}