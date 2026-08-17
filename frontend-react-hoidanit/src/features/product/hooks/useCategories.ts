import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { Category, CategoryFilterParams } from '../types/category.types';

export const CATEGORY_QUERY_KEY = ['categories'] as const;

export interface FlatCategory extends Omit<Category, 'children'> {
  depth: number;
  parentName: string | null;
}

export const flattenCategories = (categories: Category[], depth = 0): FlatCategory[] =>
  categories.flatMap((category) => [
    {
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      slug: category.slug,
      depth,
      parentName: null,
    },
    ...flattenCategories(category.children, depth + 1),
  ]);

export const useCategories = (params?: CategoryFilterParams) => {
  const query = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: categoryService.getCategories,
  });

  const tree = query.data ?? [];
  const rawFlat = flattenCategories(tree);
  const flat = rawFlat.map((item) => {
    const parent = rawFlat.find((c) => c.id === item.parentId);
    return { ...item, parentName: parent ? parent.name : null };
  });

  const filteredFlat = flat.filter((category) => {
    if (!params?.search) return true;
    const term = params.search.toLowerCase();
    return (
      category.name.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term) ||
      category.id.toString().includes(term)
    );
  });

  return {
    ...query,
    tree,
    categories: filteredFlat,
    allCategories: flat,
    totalCount: flat.length,
  };
};
