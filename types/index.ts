export type Role = 'admin' | 'viewer';
export type TaskStatus = 'pending' | 'completed';
export type TaskFilter = 'all' | 'pending' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface ListMember {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface TodoList {
  id: string;
  name: string;
  ownerId: string;
  members: ListMember[];
  taskCount: number;
  completedCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  description: string;
  status: TaskStatus;
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
  selectedListId: string | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasksByListId: Record<string, Task[]>;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export interface UIState {
  createListModalOpen: boolean;
  editListModalOpen: boolean;
  editingListId: string | null;
  createTaskModalOpen: boolean;
  editTaskModalOpen: boolean;
  editingTaskId: string | null;
  deleteConfirmOpen: boolean;
  deleteTarget: { type: 'list' | 'task'; id: string } | null;
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
  id: string;
  name: string;
}

export interface CreateTaskPayload {
  listId: string;
  title: string;
  description: string;
}

export interface UpdateTaskPayload {
  id: string;
  listId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}
