import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { CATEGORY_QUERY_KEY } from './useCategories';
import { PRODUCT_QUERY_KEY } from './useProducts';
import type { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, targetCategoryId }: { id: number; targetCategoryId?: number }) =>
      categoryService.deleteCategory(id, targetCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};
