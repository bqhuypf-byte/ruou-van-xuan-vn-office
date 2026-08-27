import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pageService } from '../services/page.service';
import { ADMIN_PAGE_QUERY_KEY } from './usePages';
import type { CreatePageInput, UpdatePageInput } from '../types/home.types';

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_PAGE_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ['page'] });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePageInput) => pageService.createPage(input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePageInput }) =>
      pageService.updatePage(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pageService.deletePage(id),
    onSuccess: () => invalidate(queryClient),
  });
};
