'use client';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTask } from '@/store/slices/tasksSlice';
import { closeEditTaskModal } from '@/store/slices/uiSlice';

export default function EditTaskModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.ui.editTaskModalOpen);
  const editingTaskId = useAppSelector(state => state.ui.editingTaskId);
  const token = useAppSelector(state => state.auth.token);
  const selectedListId = useAppSelector(state => state.todoLists.selectedListId);
  const task = useAppSelector(state => {
    if (!selectedListId || !editingTaskId) return null;
    return (state.tasks.tasksByListId[selectedListId] ?? []).find(t => t.id === editingTaskId) ?? null;
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
    }
  }, [task]);

  function handleClose() {
    setErrors({});
    dispatch(closeEditTaskModal());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return; }
    if (!token || !editingTaskId || !selectedListId) return;
    setLoading(true);
    try {
      await dispatch(updateTask({
        token,
        payload: { id: editingTaskId, listId: selectedListId, title: title.trim(), description: description.trim() },
      })).unwrap();
      handleClose();
    } catch {
      // error handled in slice
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors({}); }}
          error={errors.title}
          autoFocus
        />
        <Textarea
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" type="button" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}