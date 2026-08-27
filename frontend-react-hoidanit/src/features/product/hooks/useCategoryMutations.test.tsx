import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategoryMutations';
import { categoryService } from '../services/category.service';
import type { Category } from '../types/category.types';

vi.mock('../services/category.service', () => ({
  categoryService: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

const mockCategory: Category = {
  id: 1,
  parentId: null,
  name: 'Electronics',
  slug: 'electronics',
  description: null,
  thumbnailUrl: null,
  showInProductSections: true,
  homeSectionTitle: null,
  homeSortOrder: 0,
  homeDisplayStyle: 'grid' as const,  children: [],
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useCreateCategory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls categoryService.createCategory with the given input', async () => {
    vi.mocked(categoryService.createCategory).mockResolvedValue(mockCategory);
    const { result } = renderHook(() => useCreateCategory(), { wrapper });

    result.current.mutate({ name: 'Electronics', slug: 'electronics' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(categoryService.createCategory).toHaveBeenCalledWith({
      name: 'Electronics',
      slug: 'electronics',
    });
  });

  it('surfaces an error when the API call fails', async () => {
    vi.mocked(categoryService.createCategory).mockRejectedValue(new Error('conflict'));
    const { result } = renderHook(() => useCreateCategory(), { wrapper });

    result.current.mutate({ name: 'Electronics', slug: 'electronics' });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateCategory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls categoryService.updateCategory with id and input', async () => {
    vi.mocked(categoryService.updateCategory).mockResolvedValue(mockCategory);
    const { result } = renderHook(() => useUpdateCategory(), { wrapper });

    result.current.mutate({ id: 1, input: { name: 'Updated' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(categoryService.updateCategory).toHaveBeenCalledWith(1, { name: 'Updated' });
  });
});

describe('useDeleteCategory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls categoryService.deleteCategory with the id', async () => {
    vi.mocked(categoryService.deleteCategory).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteCategory(), { wrapper });

    result.current.mutate({ id: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(categoryService.deleteCategory).toHaveBeenCalledWith(1, undefined);
  });

  it('calls categoryService.deleteCategory with a reassignment target', async () => {
    vi.mocked(categoryService.deleteCategory).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteCategory(), { wrapper });

    result.current.mutate({ id: 1, targetCategoryId: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(categoryService.deleteCategory).toHaveBeenCalledWith(1, 2);
  });
});
