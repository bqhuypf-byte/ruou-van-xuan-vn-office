import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { RegisterInput } from '../types/auth.types';

export const useRegister = () => {
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
  });
};
