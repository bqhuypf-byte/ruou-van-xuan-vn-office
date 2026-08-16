import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Spinner } from '@/shared/components/ui';
import { useAuthStore } from '../stores/auth.store';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
