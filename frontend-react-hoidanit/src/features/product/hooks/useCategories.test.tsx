import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCategories, flattenCategories } from './useCategories';
import { categoryService } from '../services/category.service';
import type { Category } from '../types/category.types';

vi.mock('../services/category.service', () => ({
  categoryService: {
    getCategories: vi.fn(),
  },
}));

const mockTree: Category[] = [
  {
    id: 1,
    parentId: null,
    name: 'Electronics',
    slug: 'electronics',
    children: [
      { id: 2, parentId: 1, name: 'Phones', slug: 'phones', children: [] },
      { id: 3, parentId: 1, name: 'Laptops', slug: 'laptops', children: [] },
    ],
  },
  { id: 4, parentId: null, name: 'Fashion', slug: 'fashion', children: [] },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('flattenCategories', () => {
  it('flattens a nested tree into a depth-annotated list', () => {
    const flat = flattenCategories(mockTree);

    expect(flat).toHaveLength(4);
    expect(flat.map((c) => c.name)).toEqual(['Electronics', 'Phones', 'Laptops', 'Fashion']);
    expect(flat.find((c) => c.name === 'Phones')?.depth).toBe(1);
    expect(flat.find((c) => c.name === 'Electronics')?.depth).toBe(0);
  });
});

describe('useCategories', () => {
  beforeEach(() => {
    vi.mocked(categoryService.getCategories).mockResolvedValue(mockTree);
  });

  it('returns a flattened list with resolved parent names', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalCount).toBe(4);
    const phones = result.current.categories.find((c) => c.name === 'Phones');
    expect(phones?.parentName).toBe('Electronics');
    const electronics = result.current.categories.find((c) => c.name === 'Electronics');
    expect(electronics?.parentName).toBeNull();
  });

  it('filters categories by name (case-insensitive)', async () => {
    const { result } = renderHook(() => useCategories({ search: 'phone' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].name).toBe('Phones');
    expect(result.current.allCategories).toHaveLength(4);
  });

  it('filters categories by slug', async () => {
    const { result } = renderHook(() => useCategories({ search: 'fashion' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories.map((c) => c.name)).toEqual(['Fashion']);
  });
});
