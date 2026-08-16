export interface Role {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleInput {
  name: string;
}

export interface UpdateRoleInput {
  name?: string;
}

export interface RoleFilterParams {
  search?: string;
}
