import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  toggleTaskService,
  updateTaskService,
} from '@/services/taskService';
import type { CreateTaskPayload, TasksState, UpdateTaskPayload } from '@/types';

const initialState: TasksState = {
  tasksByListId: {},
  loading: false,
  submitting: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ token, listId }: { token: string; listId: string }, { rejectWithValue }) => {
    try {
      const tasks = await getTasksService(token, listId);
      return { listId, tasks };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ token, payload }: { token: string; payload: CreateTaskPayload }, { rejectWithValue }) => {
    try {
      return await createTaskService(token, payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ token, payload }: { token: string; payload: UpdateTaskPayload }, { rejectWithValue }) => {
    try {
      return await updateTaskService(token, payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (
    { token, listId, taskId }: { token: string; listId: string; taskId: string },
    { rejectWithValue }
  ) => {
    try {
      await deleteTaskService(token, listId, taskId);
      return { listId, taskId };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async (
    { token, listId, taskId }: { token: string; listId: string; taskId: string },
    { rejectWithValue }
  ) => {
    try {
      return await toggleTaskService(token, listId, taskId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to toggle task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError(state) {
      state.error = null;
    },
    clearTasksForList(state, { payload }: { payload: string }) {
      delete state.tasksByListId[payload];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasksByListId[payload.listId] = payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(createTask.pending, state => { state.submitting = true; })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.submitting = false;
        const key = String(payload.todoListId);
        if (!state.tasksByListId[key]) state.tasksByListId[key] = [];
        state.tasksByListId[key].unshift(payload);
      })
      .addCase(createTask.rejected, (state, { payload }) => {
        state.submitting = false;
        state.error = payload as string;
      })
      .addCase(updateTask.pending, state => { state.submitting = true; })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.submitting = false;
        const tasks = state.tasksByListId[String(payload.todoListId)];
        if (tasks) {
          const idx = tasks.findIndex(t => t.id === payload.id);
          if (idx !== -1) tasks[idx] = payload;
        }
      })
      .addCase(updateTask.rejected, (state, { payload }) => {
        state.submitting = false;
        state.error = payload as string;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        const tasks = state.tasksByListId[payload.listId];
        if (tasks) {
          state.tasksByListId[payload.listId] = tasks.filter(t => t.id !== Number(payload.taskId));
        }
      })
      .addCase(toggleTask.fulfilled, (state, { payload }) => {
        const tasks = state.tasksByListId[String(payload.todoListId)];
        if (tasks) {
          const idx = tasks.findIndex(t => t.id === payload.id);
          if (idx !== -1) tasks[idx] = payload;
        }
      });
  },
});

export const { clearTasksError, clearTasksForList } = tasksSlice.actions;
export default tasksSlice.reducer;