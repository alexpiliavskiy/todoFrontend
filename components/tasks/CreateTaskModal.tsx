'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTask } from '@/store/slices/tasksSlice';
import { closeCreateTaskModal } from '@/store/slices/uiSlice';

export default function CreateTaskModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.ui.createTaskModalOpen);
  const token = useAppSelector(state => state.auth.token);
  const selectedListId = useAppSelector(state => state.todoLists.selectedListId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setTitle('');
    setDescription('');
    setErrors({});
    dispatch(closeCreateTaskModal());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return; }
    if (!token || !selectedListId) return;
    setLoading(true);
    try {
      await dispatch(createTask({ token, payload: { listId: selectedListId, title: title.trim(), description: description.trim() } })).unwrap();
      handleClose();
    } catch {
      // error handled in slice
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors({}); }}
          error={errors.title}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="Add more details (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" type="button" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}