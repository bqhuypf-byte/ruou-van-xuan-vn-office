import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return <>{children}</>;
};
