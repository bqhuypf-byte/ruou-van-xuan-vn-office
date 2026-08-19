import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesPage } from './CategoriesPage';
import { useCategories } from '../hooks/useCategories';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useCategoryMutations';
import type { FlatCategory } from '../hooks/useCategories';

vi.mock('../hooks/useCategories');
vi.mock('../hooks/useCategoryMutations');

const mockCategories: FlatCategory[] = [
  {
    id: 1,
    parentId: null,
    name: 'Electronics',
    slug: 'electronics',
    description: null,
    thumbnailUrl: null,
    showInTopCategories: false,
    showInDailyEssentials: false,
    homeSortOrder: 0,
    depth: 0,
    parentName: null,
  },
  {
    id: 2,
    parentId: 1,
    name: 'Phones',
    slug: 'phones',
    description: null,
    thumbnailUrl: null,
    showInTopCategories: false,
    showInDailyEssentials: false,
    homeSortOrder: 0,
    depth: 1,
    parentName: 'Electronics',
  },
];

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.mocked(useCategories).mockReturnValue({
      tree: [],
      categories: mockCategories,
      allCategories: mockCategories,
      totalCount: mockCategories.length,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCategories>);

    vi.mocked(useCreateCategory).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateCategory>,
    );
    vi.mocked(useUpdateCategory).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateCategory>,
    );
    vi.mocked(useDeleteCategory).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteCategory>,
    );
  });

  it('renders the page title and category rows', () => {
    render(<CategoriesPage />);

    expect(screen.getByText('Quản Lý Danh Mục (Category CRUD)')).toBeInTheDocument();
    expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
    expect(screen.getByText('Phones')).toBeInTheDocument();
  });

  it('shows an API error banner with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useCategories).mockReturnValue({
      tree: [],
      categories: [],
      allCategories: [],
      totalCount: 0,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch,
    } as unknown as ReturnType<typeof useCategories>);

    const user = userEvent.setup();
    render(<CategoriesPage />);

    expect(screen.getByText(/Không thể tải danh sách danh mục/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('creates a category via the form modal and shows a success banner', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateCategory).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateCategory>);

    const user = userEvent.setup();
    render(<CategoriesPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Danh Mục/i }));
    await user.type(screen.getByLabelText(/Tên danh mục/i), 'Laptops');
    await user.type(screen.getByLabelText(/Slug/i), 'laptops');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        name: 'Laptops',
        slug: 'laptops',
        showInTopCategories: false,
        showInDailyEssentials: false,
        homeSortOrder: 0,
      }),
    );
    expect(
      await screen.findByText('Đã tạo danh mục "Laptops" thành công.'),
    ).toBeInTheDocument();
  });

  it('deletes a category via the confirmation modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteCategory>);

    const user = userEvent.setup();
    render(<CategoriesPage />);

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Xóa Danh Mục' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({ id: 1, targetCategoryId: undefined }),
    );
    expect(
      await screen.findByText('Đã xóa danh mục "Electronics" thành công.'),
    ).toBeInTheDocument();
  });

  it('prompts to reassign products when deleting a category that still has products', async () => {
    const mutateAsync = vi
      .fn()
      .mockRejectedValueOnce({
        response: { data: { error: { code: 'CategoryHasProductsException' } } },
      })
      .mockResolvedValueOnce(undefined);
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteCategory>);

    const user = userEvent.setup();
    render(<CategoriesPage />);

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Xóa Danh Mục' }));

    expect(
      await screen.findByText(/vẫn còn sản phẩm bên trong/i),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox'), '2');
    await user.click(screen.getByRole('button', { name: 'Chuyển & Xóa' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenLastCalledWith({ id: 1, targetCategoryId: 2 }),
    );
    expect(
      await screen.findByText('Đã xóa danh mục "Electronics" thành công.'),
    ).toBeInTheDocument();
  });

  it('shows an error banner when the create mutation fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { error: { message: 'Slug đã tồn tại' } } },
    });
    vi.mocked(useCreateCategory).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateCategory>);

    const user = userEvent.setup();
    render(<CategoriesPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Danh Mục/i }));
    await user.type(screen.getByLabelText(/Tên danh mục/i), 'Electronics');
    await user.type(screen.getByLabelText(/Slug/i), 'electronics');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(await screen.findByText('Slug đã tồn tại')).toBeInTheDocument();
  });
});
