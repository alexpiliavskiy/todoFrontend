'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLists } from '@/store/slices/todoListsSlice';
import Sidebar from '@/components/layout/Sidebar';
import CreateListModal from '@/components/lists/CreateListModal';
import EditListModal from '@/components/lists/EditListModal';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import DeleteConfirmHandler from '@/components/layout/DeleteConfirmHandler';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchLists(token));
    }
  }, [isAuthenticated, token, dispatch]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0f1729]">
        {children}
      </main>
      <CreateListModal />
      <EditListModal />
      <CreateTaskModal />
      <EditTaskModal />
      <DeleteConfirmHandler />
    </div>
  );
}