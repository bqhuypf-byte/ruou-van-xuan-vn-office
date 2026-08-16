export interface User {
  id: number;
  roleId: number | null;
  email: string;
  fullName: string;
  phone?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  phone?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UserFilterParams {
  search?: string;
}
