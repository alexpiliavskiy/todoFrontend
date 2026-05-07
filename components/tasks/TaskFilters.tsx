'use client';
import type { TaskFilter } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTaskFilter } from '@/store/slices/uiSlice';

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(state => state.ui.taskFilter);

  return (
    <div className="flex gap-1 rounded-lg bg-slate-800 p-1">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => dispatch(setTaskFilter(f.value))}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            current === f.value
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}