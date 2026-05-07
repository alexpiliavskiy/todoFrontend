import { createSlice } from '@reduxjs/toolkit';
import type { UIState } from '@/types';

const initialState: UIState = {
  createListModalOpen: false,
  editListModalOpen: false,
  editingListId: null,
  createTaskModalOpen: false,
  editTaskModalOpen: false,
  editingTaskId: null,
  deleteConfirmOpen: false,
  deleteTarget: null,
  taskFilter: 'all',
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreateListModal(state) {
      state.createListModalOpen = true;
    },
    closeCreateListModal(state) {
      state.createListModalOpen = false;
    },
    openEditListModal(state, { payload }: { payload: string }) {
      state.editListModalOpen = true;
      state.editingListId = payload;
    },
    closeEditListModal(state) {
      state.editListModalOpen = false;
      state.editingListId = null;
    },
    openCreateTaskModal(state) {
      state.createTaskModalOpen = true;
    },
    closeCreateTaskModal(state) {
      state.createTaskModalOpen = false;
    },
    openEditTaskModal(state, { payload }: { payload: string }) {
      state.editTaskModalOpen = true;
      state.editingTaskId = payload;
    },
    closeEditTaskModal(state) {
      state.editTaskModalOpen = false;
      state.editingTaskId = null;
    },
    openDeleteConfirm(state, { payload }: { payload: { type: 'list' | 'task'; id: string } }) {
      state.deleteConfirmOpen = true;
      state.deleteTarget = payload;
    },
    closeDeleteConfirm(state) {
      state.deleteConfirmOpen = false;
      state.deleteTarget = null;
    },
    setTaskFilter(state, { payload }: { payload: UIState['taskFilter'] }) {
      state.taskFilter = payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
  },
});

export const {
  openCreateListModal,
  closeCreateListModal,
  openEditListModal,
  closeEditListModal,
  openCreateTaskModal,
  closeCreateTaskModal,
  openEditTaskModal,
  closeEditTaskModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  setTaskFilter,
  toggleSidebar,
  closeSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;