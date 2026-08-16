import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/role.service';
import type { RoleFilterParams } from '../types/role.types';

export const ROLE_QUERY_KEY = ['roles'] as const;

export const useRoles = (params?: RoleFilterParams) => {
  const query = useQuery({
    queryKey: ROLE_QUERY_KEY,
    queryFn: roleService.getRoles,
  });

  const filteredRoles = query.data?.filter((role) => {
    if (!params?.search) return true;
    const term = params.search.toLowerCase();
    return (
      role.name.toLowerCase().includes(term) ||
      role.id.toString().includes(term)
    );
  });

  return {
    ...query,
    roles: filteredRoles ?? [],
    allRoles: query.data ?? [],
    totalCount: query.data?.length ?? 0,
  };
};
