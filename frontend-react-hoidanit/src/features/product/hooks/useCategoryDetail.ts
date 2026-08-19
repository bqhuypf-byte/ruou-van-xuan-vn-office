import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';

export const CATEGORY_DETAIL_QUERY_KEY = ['category-detail'] as const;

export const useCategoryDetail = (slug: string) =>
  useQuery({
    queryKey: [...CATEGORY_DETAIL_QUERY_KEY, slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
