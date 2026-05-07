'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!loading) {
      router.replace(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}