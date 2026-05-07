'use client';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateList } from '@/store/slices/todoListsSlice';
import { closeEditListModal } from '@/store/slices/uiSlice';

export default function EditListModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.ui.editListModalOpen);
  const editingListId = useAppSelector(state => state.ui.editingListId);
  const token = useAppSelector(state => state.auth.token);
  const list = useAppSelector(state =>
    state.todoLists.lists.find(l => l.id === editingListId)
  );

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (list) setName(list.name);
  }, [list]);

  function handleClose() {
    setError('');
    dispatch(closeEditListModal());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('List name is required'); return; }
    if (!token || !editingListId) return;
    setLoading(true);
    try {
      await dispatch(updateList({ token, payload: { id: editingListId, name: name.trim() } })).unwrap();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Rename List" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="List name"
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
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}