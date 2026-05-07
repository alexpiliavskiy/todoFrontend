'use client';
import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { restoreSession } from '@/store/slices/authSlice';

function SessionRestorer() {
  const restored = useRef(false);
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      store.dispatch(restoreSession());
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionRestorer />
      {children}
    </Provider>
  );
}