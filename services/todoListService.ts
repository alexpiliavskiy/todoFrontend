import type { CreateListPayload, TodoList, UpdateListPayload } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_LISTS: Record<string, TodoList[]> = {};

function getUserId(token: string): string {
  try {
    const payload = JSON.parse(atob(token)) as { userId: string };
    return payload.userId;
  } catch {
    throw new Error('Invalid token');
  }
}

function seedListsForUser(userId: string): void {
  if (MOCK_LISTS[userId]) return;
  MOCK_LISTS[userId] = [
    {
      id: `list-seed-1-${userId}`,
      name: 'My Personal Tasks',
      ownerId: userId,
      members: [{ userId, name: 'You', email: '', role: 'admin' }],
      taskCount: 3,
      completedCount: 1,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: `list-seed-2-${userId}`,
      name: 'Work Projects',
      ownerId: userId,
      members: [{ userId, name: 'You', email: '', role: 'admin' }],
      taskCount: 5,
      completedCount: 2,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: `list-seed-3-${userId}`,
      name: 'Shared with Me (View Only)',
      ownerId: 'user-other',
      members: [{ userId, name: 'You', email: '', role: 'viewer' }],
      taskCount: 4,
      completedCount: 4,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export async function getListsService(token: string): Promise<TodoList[]> {
  await delay(500);
  const userId = getUserId(token);
  seedListsForUser(userId);
  return [...MOCK_LISTS[userId]];
}

export async function createListService(token: string, payload: CreateListPayload): Promise<TodoList> {
  await delay(600);
  const userId = getUserId(token);
  seedListsForUser(userId);
  const newList: TodoList = {
    id: `list-${Date.now()}`,
    name: payload.name,
    ownerId: userId,
    members: [{ userId, name: 'You', email: '', role: 'admin' }],
    taskCount: 0,
    completedCount: 0,
    createdAt: new Date().toISOString(),
  };
  MOCK_LISTS[userId].unshift(newList);
  return newList;
}

export async function updateListService(token: string, payload: UpdateListPayload): Promise<TodoList> {
  await delay(500);
  const userId = getUserId(token);
  seedListsForUser(userId);
  const idx = MOCK_LISTS[userId].findIndex(l => l.id === payload.id);
  if (idx === -1) throw new Error('List not found');
  MOCK_LISTS[userId][idx] = { ...MOCK_LISTS[userId][idx], name: payload.name };
  return MOCK_LISTS[userId][idx];
}

export async function deleteListService(token: string, listId: string): Promise<void> {
  await delay(400);
  const userId = getUserId(token);
  seedListsForUser(userId);
  MOCK_LISTS[userId] = MOCK_LISTS[userId].filter(l => l.id !== listId);
}

export function updateListCounts(
  token: string,
  listId: string,
  taskCount: number,
  completedCount: number
): void {
  try {
    const userId = getUserId(token);
    if (!MOCK_LISTS[userId]) return;
    const idx = MOCK_LISTS[userId].findIndex(l => l.id === listId);
    if (idx !== -1) {
      MOCK_LISTS[userId][idx] = { ...MOCK_LISTS[userId][idx], taskCount, completedCount };
    }
  } catch {
    // ignore
  }
}
