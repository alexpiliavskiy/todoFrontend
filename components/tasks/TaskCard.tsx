'use client';
import type { Role, Task } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTask } from '@/store/slices/tasksSlice';
import { openDeleteConfirm, openEditTaskModal } from '@/store/slices/uiSlice';
import { updateListCounts } from '@/store/slices/todoListsSlice';

interface TaskCardProps {
  task: Task;
  role: Role;
}

export default function TaskCard({ task, role }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const selectedListId = useAppSelector(state => state.todoLists.selectedListId);
  const tasks = useAppSelector(state =>
    selectedListId ? (state.tasks.tasksByListId[selectedListId] ?? []) : []
  );
  const submitting = useAppSelector(state => state.tasks.submitting);

  const isAdmin = role === 'admin';
  const isCompleted = task.status === 'completed';

  async function handleToggle() {
    if (!token) return;
    await dispatch(toggleTask({ token, listId: task.listId, taskId: task.id }));
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, status: isCompleted ? ('pending' as const) : ('completed' as const) } : t
    );
    const completed = updatedTasks.filter(t => t.status === 'completed').length;
    if (selectedListId) {
      dispatch(updateListCounts({ listId: selectedListId, taskCount: updatedTasks.length, completedCount: completed }));
    }
  }

  function handleEdit() {
    dispatch(openEditTaskModal(task.id));
  }

  function handleDelete() {
    dispatch(openDeleteConfirm({ type: 'task', id: task.id }));
  }

  const formattedDate = new Date(task.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div className={`group relative rounded-xl border bg-slate-800/60 p-4 transition-all hover:bg-slate-800 ${
      isCompleted ? 'border-slate-700/50 opacity-70' : 'border-slate-700'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={submitting}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            isCompleted
              ? 'border-emerald-500 bg-emerald-500'
              : 'border-slate-500 hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium leading-snug ${
            isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
          }`}>
            {task.title}
          </p>
          {task.description && (
            <p className={`mt-1 text-xs leading-relaxed ${
              isCompleted ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-600">{formattedDate}</p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleEdit}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-700 hover:text-slate-200 transition-colors"
              aria-label="Edit task"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              aria-label="Delete task"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}