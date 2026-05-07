'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createList } from '@/store/slices/todoListsSlice';
import { closeCreateListModal } from '@/store/slices/uiSlice';

export default function CreateListModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.ui.createListModalOpen);
  const token = useAppSelector(state => state.auth.token);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setName('');
    setError('');
    dispatch(closeCreateListModal());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('List name is required'); return; }
    if (!token) return;
    setLoading(true);
    try {
      await dispatch(createList({ token, payload: { name: name.trim() } })).unwrap();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New List" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="List name"
          placeholder="e.g. Work Projects"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          error={error}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
}