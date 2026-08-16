import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

export const useMe = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: authService.getMe,
    enabled: isAuthenticated,
  });
};
