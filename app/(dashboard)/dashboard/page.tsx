'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const { lists, loading, selectedListId } = useAppSelector(state => state.todoLists);

  useEffect(() => {
    if (!loading && lists.length > 0) {
      const id = selectedListId ?? lists[0].id;
      router.replace(`/dashboard/list/${id}`);
    }
  }, [lists, loading, selectedListId, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!loading && lists.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-full bg-slate-800 p-6">
          <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">No lists yet</h2>
          <p className="mt-1 text-slate-400">Create your first list using the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}