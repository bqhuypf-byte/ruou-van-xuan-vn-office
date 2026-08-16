import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { ME_QUERY_KEY } from './useMe';
import type { ChangePasswordInput, UpdateProfileInput } from '../types/auth.types';

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authService.changePassword(input),
  });
};
