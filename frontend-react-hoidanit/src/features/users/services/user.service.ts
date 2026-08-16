import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user.types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<ApiResponse<User[]> | User[]>('/users');
    if ('data' in response.data && Array.isArray((response.data as ApiResponse<User[]>).data)) {
      return (response.data as ApiResponse<User[]>).data;
    }
    return response.data as User[];
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User> | User>(`/users/${id}`);
    if ('data' in response.data && (response.data as ApiResponse<User>).data) {
      return (response.data as ApiResponse<User>).data;
    }
    return response.data as User;
  },

  createUser: async (input: CreateUserInput): Promise<User> => {
    const response = await axiosInstance.post<ApiResponse<User> | User>('/users', input);
    if ('data' in response.data && (response.data as ApiResponse<User>).data) {
      return (response.data as ApiResponse<User>).data;
    }
    return response.data as User;
  },

  updateUser: async (id: number, input: UpdateUserInput): Promise<User> => {
    const response = await axiosInstance.patch<ApiResponse<User> | User>(`/users/${id}`, input);
    if ('data' in response.data && (response.data as ApiResponse<User>).data) {
      return (response.data as ApiResponse<User>).data;
    }
    return response.data as User;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
