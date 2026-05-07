'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectList } from '@/store/slices/todoListsSlice';
import { logout } from '@/store/slices/authSlice';
import { openCreateListModal, openEditListModal, openDeleteConfirm, closeSidebar } from '@/store/slices/uiSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { TodoList } from '@/types';
import Link from "next/link";

function ListItem({ list, isSelected, isAdmin }: { list: TodoList; isSelected: boolean; isAdmin: boolean }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleSelect() {
    dispatch(selectList(list.id));
    dispatch(closeSidebar());
    router.push(`/dashboard/list/${list.id}`);
  }

  return (
    <div
      className={`group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        isSelected ? 'bg-indigo-600/20 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
      }`}
      onClick={handleSelect}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
      }`}>
        {list.name[0].toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isSelected ? 'text-white' : ''}`}>{list.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500 shrink-0">
            {list.completedCount}/{list.taskCount}
          </span>
        </div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); dispatch(openEditListModal(list.id)); }}
            className="rounded p-1 hover:bg-slate-600 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Edit list"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); dispatch(openDeleteConfirm({ type: 'list', id: list.id })); }}
            className="rounded p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
            aria-label="Delete list"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { lists, loading, selectedListId } = useAppSelector(state => state.todoLists);
  const user = useAppSelector(state => state.auth.user);
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);
  const currentUserId = user?.id;

  function handleLogout() {
    dispatch(logout());
    router.push('/login');
  }

  const listItems = lists.map(list => {
    const member = list.members.find(m => m.userId === currentUserId);
    const isAdmin = member?.role === 'admin';
    return (
      <ListItem
        key={list.id}
        list={list}
        isSelected={list.id === selectedListId}
        isAdmin={isAdmin}
      />
    );
  });

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <Link href='/' className="flex items-center gap-2 px-4 py-5 border-b border-slate-700/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span className="font-semibold text-white">Task App</span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Lists</span>
          <button
            onClick={() => dispatch(openCreateListModal())}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-200 transition-colors"
            aria-label="New list"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : lists.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-sm text-slate-500">No lists yet</p>
            <button
              onClick={() => dispatch(openCreateListModal())}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">{listItems}</div>
        )}
      </div>

      <div className="border-t border-slate-700/50 px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/30 text-sm font-semibold text-indigo-300">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-700 hover:text-slate-200 transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-slate-900 border-r border-slate-700/50 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => dispatch(closeSidebar())}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-slate-900 border-r border-slate-700/50 md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
