import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createListService,
  deleteListService,
  getListsService,
  updateListService,
} from '@/services/todoListService';
import type { CreateListPayload, TodoListsState, UpdateListPayload } from '@/types';

const initialState: TodoListsState = {
  lists: [],
  selectedListId: null,
  loading: false,
  error: null,
};

export const fetchLists = createAsyncThunk('todoLists/fetchLists', async (token: string, { rejectWithValue }) => {
  try {
    return await getListsService(token);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Failed to load lists');
  }
});

export const createList = createAsyncThunk(
  'todoLists/createList',
  async ({ token, payload }: { token: string; payload: CreateListPayload }, { rejectWithValue }) => {
    try {
      return await createListService(token, payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to create list');
    }
  }
);

export const updateList = createAsyncThunk(
  'todoLists/updateList',
  async ({ token, payload }: { token: string; payload: UpdateListPayload }, { rejectWithValue }) => {
    try {
      return await updateListService(token, payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to update list');
    }
  }
);

export const deleteList = createAsyncThunk(
  'todoLists/deleteList',
  async ({ token, listId }: { token: string; listId: string }, { rejectWithValue }) => {
    try {
      await deleteListService(token, listId);
      return listId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to delete list');
    }
  }
);

const todoListsSlice = createSlice({
  name: 'todoLists',
  initialState,
  reducers: {
    selectList(state, { payload }: { payload: string }) {
      state.selectedListId = payload;
    },
    clearListsError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLists.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchLists.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lists = payload;
        if (!state.selectedListId && payload.length > 0) {
          state.selectedListId = String(payload[0].id);
        }
      })
      .addCase(fetchLists.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(createList.fulfilled, (state, { payload }) => {
        state.lists.unshift(payload);
        state.selectedListId = String(payload.id);
      })
      .addCase(updateList.fulfilled, (state, { payload }) => {
        const idx = state.lists.findIndex(l => l.id === payload.id);
        if (idx !== -1) state.lists[idx] = payload;
      })
      .addCase(deleteList.fulfilled, (state, { payload }) => {
        state.lists = state.lists.filter(l => String(l.id) !== payload);
        if (state.selectedListId === payload) {
          state.selectedListId = state.lists.length > 0 ? String(state.lists[0].id) : null;
        }
      });
  },
});

export const { selectList, clearListsError } = todoListsSlice.actions;
export default todoListsSlice.reducer;