import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: AuthUser | null) => void;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  bootstrap: async () => {
    try {
      await authService.refresh();
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isInitializing: false });
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
