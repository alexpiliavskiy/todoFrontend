export type Role = 'admin' | 'viewer';
export type TaskFilter = 'all' | 'pending' | 'completed';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

// Shape returned inside TodoList.members (GET /api/lists)
export interface ListMemberBrief {
  role: Role;
}

// Shape returned by GET /api/lists/:id/members
export interface ListMember {
  id: number;
  todoListId: number;
  userId: number;
  role: Role;
  user: { id: number; name: string; email: string };
}

export interface TodoList {
  id: number;
  name: string;
  members: ListMemberBrief[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  todoListId: number;
  title: string;
  description: string | null;
  isDone: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TodoListsState {
  lists: TodoList[];
  selectedListId: string | null; // string for URL param compatibility
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasksByListId: Record<string, Task[]>; // keyed by String(listId)
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export interface UIState {
  createListModalOpen: boolean;
  editListModalOpen: boolean;
  editingListId: number | null;
  createTaskModalOpen: boolean;
  editTaskModalOpen: boolean;
  editingTaskId: number | null;
  deleteConfirmOpen: boolean;
  deleteTarget: { type: 'list' | 'task'; id: number } | null;
  taskFilter: TaskFilter;
  sidebarOpen: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface CreateListPayload {
  name: string;
}

export interface UpdateListPayload {
  id: number;
  name: string;
}

export interface CreateTaskPayload {
  listId: string;
  title: string;
  description: string;
}

export interface UpdateTaskPayload {
  id: number;
  listId: string;
  title?: string;
  description?: string;
}