import { useAppSelector } from '@/store/hooks';

export function useAuth() {
  return useAppSelector(state => state.auth);
}

export function useCurrentUser() {
  return useAppSelector(state => state.auth.user);
}

export function useIsAuthenticated() {
  return useAppSelector(state => state.auth.isAuthenticated);
}