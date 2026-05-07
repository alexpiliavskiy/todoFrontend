import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_TASKS: Record<string, Task[]> = {};

function seedTasksForList(listId: string): void {
  if (MOCK_TASKS[listId]) return;

  if (listId.includes('seed-1')) {
    MOCK_TASKS[listId] = [
      {
        id: `task-${listId}-1`,
        listId,
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and vegetables',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: `task-${listId}-2`,
        listId,
        title: 'Call dentist',
        description: 'Schedule appointment for next month',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: `task-${listId}-3`,
        listId,
        title: 'Read book',
        description: '"Atomic Habits" — finish chapters 5–8',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  } else if (listId.includes('seed-2')) {
    MOCK_TASKS[listId] = [
      {
        id: `task-${listId}-1`,
        listId,
        title: 'Design system review',
        description: 'Review updated Figma components with the design team',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: `task-${listId}-2`,
        listId,
        title: 'Write unit tests',
        description: 'Cover auth service and task reducers with Jest',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: `task-${listId}-3`,
        listId,
        title: 'API integration',
        description: 'Replace mock services with real backend endpoints',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: `task-${listId}-4`,
        listId,
        title: 'Deploy to staging',
        description: 'Configure CI/CD pipeline and trigger staging deploy',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: `task-${listId}-5`,
        listId,
        title: 'Code review PR #42',
        description: 'Review Alex\'s authentication PR before merging',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  } else if (listId.includes('seed-3')) {
    MOCK_TASKS[listId] = [
      {
        id: `task-${listId}-1`,
        listId,
        title: 'Q1 Marketing Report',
        description: 'Compile metrics from all campaigns',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: `task-${listId}-2`,
        listId,
        title: 'Budget review',
        description: 'Cross-check Q1 spend vs budget allocation',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: `task-${listId}-3`,
        listId,
        title: 'Team standup notes',
        description: 'Archive standup notes from March',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: `task-${listId}-4`,
        listId,
        title: 'Presentation slides',
        description: 'Final slide deck for the board meeting',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  } else {
    MOCK_TASKS[listId] = [];
  }
}

export async function getTasksService(_token: string, listId: string): Promise<Task[]> {
  await delay(450);
  seedTasksForList(listId);
  return [...MOCK_TASKS[listId]];
}

export async function createTaskService(_token: string, payload: CreateTaskPayload): Promise<Task> {
  await delay(600);
  seedTasksForList(payload.listId);
  const newTask: Task = {
    id: `task-${Date.now()}`,
    listId: payload.listId,
    title: payload.title,
    description: payload.description,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_TASKS[payload.listId].unshift(newTask);
  return newTask;
}

export async function updateTaskService(_token: string, payload: UpdateTaskPayload): Promise<Task> {
  await delay(500);
  seedTasksForList(payload.listId);
  const idx = MOCK_TASKS[payload.listId].findIndex(t => t.id === payload.id);
  if (idx === -1) throw new Error('Task not found');
  MOCK_TASKS[payload.listId][idx] = {
    ...MOCK_TASKS[payload.listId][idx],
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.status !== undefined && { status: payload.status }),
    updatedAt: new Date().toISOString(),
  };
  return MOCK_TASKS[payload.listId][idx];
}

export async function deleteTaskService(_token: string, listId: string, taskId: string): Promise<void> {
  await delay(400);
  seedTasksForList(listId);
  MOCK_TASKS[listId] = MOCK_TASKS[listId].filter(t => t.id !== taskId);
}

export async function toggleTaskService(_token: string, listId: string, taskId: string): Promise<Task> {
  await delay(300);
  seedTasksForList(listId);
  const idx = MOCK_TASKS[listId].findIndex(t => t.id === taskId);
  if (idx === -1) throw new Error('Task not found');
  MOCK_TASKS[listId][idx] = {
    ...MOCK_TASKS[listId][idx],
    status: MOCK_TASKS[listId][idx].status === 'completed' ? 'pending' : 'completed',
    updatedAt: new Date().toISOString(),
  };
  return MOCK_TASKS[listId][idx];
}