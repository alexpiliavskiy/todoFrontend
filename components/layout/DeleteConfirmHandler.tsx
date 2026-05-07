'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDeleteConfirm } from '@/store/slices/uiSlice';
import { deleteList } from '@/store/slices/todoListsSlice';
import { deleteTask } from '@/store/slices/tasksSlice';

export default function DeleteConfirmHandler() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { deleteConfirmOpen, deleteTarget } = useAppSelector(state => state.ui);
  const token = useAppSelector(state => state.auth.token);
  const selectedListId = useAppSelector(state => state.todoLists.selectedListId);
  const tasks = useAppSelector(state =>
    selectedListId ? (state.tasks.tasksByListId[selectedListId] ?? []) : []
  );
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!token || !deleteTarget) return;
    setLoading(true);
    try {
      if (deleteTarget.type === 'list') {
        await dispatch(deleteList({ token, listId: String(deleteTarget.id) })).unwrap();
        router.push('/dashboard');
      } else {
        const taskToDelete = tasks.find(t => t.id === deleteTarget.id);
        if (!taskToDelete || !selectedListId) return;
        await dispatch(deleteTask({
          token,
          listId: String(taskToDelete.todoListId),
          taskId: String(deleteTarget.id),
        })).unwrap();
      }
      dispatch(closeDeleteConfirm());
    } catch {
      // errors surfaced via redux
    } finally {
      setLoading(false);
    }
  }

  const isTask = deleteTarget?.type === 'task';

  return (
    <ConfirmDialog
      open={deleteConfirmOpen}
      title={isTask ? 'Delete Task' : 'Delete List'}
      message={
        isTask
          ? 'Are you sure you want to delete this task? This action cannot be undone.'
          : 'Are you sure you want to delete this list and all its tasks? This action cannot be undone.'
      }
      confirmLabel="Delete"
      onConfirm={handleConfirm}
      onCancel={() => dispatch(closeDeleteConfirm())}
      loading={loading}
    />
  );
}