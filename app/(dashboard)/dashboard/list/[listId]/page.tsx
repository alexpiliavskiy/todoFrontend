'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectList } from '@/store/slices/todoListsSlice';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { openCreateTaskModal, toggleSidebar } from '@/store/slices/uiSlice';
import { useSelectedList, useCurrentUserRole } from '@/hooks/useTodoLists';
import { useFilteredTasks, useTasksState } from '@/hooks/useTasks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskFilters from '@/components/tasks/TaskFilters';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ListPage() {
  const params = useParams<{ listId: string }>();
  const listId = params.listId;
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const filter = useAppSelector(state => state.ui.taskFilter);
  const selectedList = useSelectedList();
  const role = useCurrentUserRole();
  const { loading } = useTasksState();
  const tasks = useFilteredTasks(listId, filter);
  const allTasks = useAppSelector(state => state.tasks.tasksByListId[listId] ?? []);
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (listId) dispatch(selectList(listId));
  }, [listId, dispatch]);

  useEffect(() => {
    if (token && listId) {
      dispatch(fetchTasks({ token, listId }));
    }
  }, [token, listId, dispatch]);

  const pendingCount = allTasks.filter(t => t.status === 'pending').length;
  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const totalCount = allTasks.length;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-[#0f1729]/95 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white truncate">
                {selectedList?.name ?? 'Loading...'}
              </h1>
              <Badge
                label={role === 'admin' ? 'Admin' : 'Viewer'}
                variant={role === 'admin' ? 'admin' : 'viewer'}
              />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-3 text-xs text-slate-500 bg-blue-950/90 px-6 py-2 rounded-lg">
                <span>{totalCount} total</span>
                |
                <span className="text-amber-400">{pendingCount} active</span>
                |
                <span className="text-emerald-400">{completedCount} done</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Button
              onClick={() => dispatch(openCreateTaskModal())}
              size="md"
              className="shrink-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 py-3 border-b border-slate-800">
        <TaskFilters />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            filter={filter}
            isAdmin={isAdmin}
            onAddTask={() => dispatch(openCreateTaskModal())}
          />
        ) : (
          <div className="space-y-3 max-w-2xl">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} role={role} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  filter,
  isAdmin,
  onAddTask,
}: {
  filter: string;
  isAdmin: boolean;
  onAddTask: () => void;
}) {
  if (filter !== 'all') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-800 p-5 mb-4">
          <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </div>
        <p className="text-slate-400">No {filter} tasks</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-slate-800 p-5 mb-4">
        <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-1">No tasks yet</h3>
      {isAdmin ? (
        <>
          <p className="text-slate-400 text-sm mb-4">Add your first task to get started</p>
          <Button onClick={onAddTask}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </Button>
        </>
      ) : (
        <p className="text-slate-400 text-sm">No tasks have been added to this list yet.</p>
      )}
    </div>
  );
}