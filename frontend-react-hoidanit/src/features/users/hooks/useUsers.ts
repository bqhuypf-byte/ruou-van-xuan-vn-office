import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { UserFilterParams } from '../types/user.types';

export const USER_QUERY_KEY = ['users'] as const;

export const useUsers = (params?: UserFilterParams) => {
  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: userService.getUsers,
  });

  const filteredUsers = query.data?.filter((user) => {
    if (!params?.search) return true;
    const term = params.search.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  });

  return {
    ...query,
    users: filteredUsers ?? [],
    allUsers: query.data ?? [],
    totalCount: query.data?.length ?? 0,
  };
};
