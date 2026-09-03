import { axiosInstance, setAccessToken } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  AuthUser,
  ChangePasswordInput,
  LoginInput,
  LoginResult,
  RefreshResult,
  RegisterInput,
  RegisterResult,
  UpdateProfileInput,
} from '../types/auth.types';

const unwrap = <T,>(data: ApiResponse<T> | T): T =>
  data && typeof data === 'object' && 'data' in data
    ? (data as ApiResponse<T>).data
    : (data as T);

export const authService = {
  register: async (input: RegisterInput): Promise<RegisterResult> => {
    const response = await axiosInstance.post<ApiResponse<RegisterResult> | RegisterResult>(
      '/auth/register',
      input,
    );
    return unwrap(response.data);
  },

  login: async (input: LoginInput): Promise<LoginResult> => {
    const response = await axiosInstance.post<ApiResponse<LoginResult> | LoginResult>(
      '/auth/login',
      input,
    );
    const result = unwrap(response.data);
    setAccessToken(result.accessToken);
    return result;
  },

  refresh: async (): Promise<RefreshResult> => {
    const response = await axiosInstance.post<ApiResponse<RefreshResult> | RefreshResult>(
      '/auth/refresh',
    );
    const result = unwrap(response.data);
    setAccessToken(result.accessToken);
    return result;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
    setAccessToken(null);
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<ApiResponse<AuthUser> | AuthUser>('/auth/me');
    return unwrap(response.data);
  },

  updateProfile: async (input: UpdateProfileInput): Promise<AuthUser> => {
    const response = await axiosInstance.patch<ApiResponse<AuthUser> | AuthUser>(
      '/auth/me',
      input,
    );
    return unwrap(response.data);
  },

  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await axiosInstance.patch('/auth/change-password', input);
  },
};
