import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CreateRoleInput, Role, UpdateRoleInput } from '../types/role.types';

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<ApiResponse<Role[]> | Role[]>('/roles');
    if ('data' in response.data && Array.isArray((response.data as ApiResponse<Role[]>).data)) {
      return (response.data as ApiResponse<Role[]>).data;
    }
    return response.data as Role[];
  },

  getRoleById: async (id: number): Promise<Role> => {
    const response = await axiosInstance.get<ApiResponse<Role> | Role>(`/roles/${id}`);
    if ('data' in response.data && (response.data as ApiResponse<Role>).data) {
      return (response.data as ApiResponse<Role>).data;
    }
    return response.data as Role;
  },

  createRole: async (input: CreateRoleInput): Promise<Role> => {
    const response = await axiosInstance.post<ApiResponse<Role> | Role>('/roles', input);
    if ('data' in response.data && (response.data as ApiResponse<Role>).data) {
      return (response.data as ApiResponse<Role>).data;
    }
    return response.data as Role;
  },

  updateRole: async (id: number, input: UpdateRoleInput): Promise<Role> => {
    const response = await axiosInstance.patch<ApiResponse<Role> | Role>(`/roles/${id}`, input);
    if ('data' in response.data && (response.data as ApiResponse<Role>).data) {
      return (response.data as ApiResponse<Role>).data;
    }
    return response.data as Role;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },
};
