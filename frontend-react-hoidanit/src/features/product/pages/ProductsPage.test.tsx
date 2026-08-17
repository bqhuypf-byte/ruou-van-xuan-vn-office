import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProductsPage } from './ProductsPage';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProductMutations';
import type { Product } from '../types/product.types';
import type { FlatCategory } from '../hooks/useCategories';

vi.mock('../hooks/useProducts');
vi.mock('../hooks/useCategories');
vi.mock('../hooks/useProductMutations');

const mockProducts: Product[] = [
  { id: 1, categoryId: 2, name: 'iPhone 15', slug: 'iphone-15', description: null, thumbnailUrl: null, isActive: true },
  { id: 2, categoryId: 2, name: 'iPhone 14', slug: 'iphone-14', description: null, thumbnailUrl: null, isActive: false },
];

const mockCategories: FlatCategory[] = [
  { id: 2, parentId: null, name: 'Phones', slug: 'phones', depth: 0, parentName: null },
];

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      allProducts: mockProducts,
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
      totalCount: 2,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProducts>);

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

    vi.mocked(useCreateProduct).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateProduct>,
    );
    vi.mocked(useUpdateProduct).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateProduct>,
    );
    vi.mocked(useDeleteProduct).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteProduct>,
    );
  });

  it('renders the page title and product rows', () => {
    renderPage();

    expect(screen.getByText('Quản Lý Sản Phẩm (Product CRUD)')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
  });

  it('shows an API error banner with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      allProducts: [],
      meta: undefined,
      totalCount: 0,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch,
    } as unknown as ReturnType<typeof useProducts>);

    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText(/Không thể tải danh sách sản phẩm/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('soft-deletes a product via the confirmation modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteProduct).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteProduct>);

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Ngừng Bán' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(1));
    expect(
      await screen.findByText('Đã ngừng bán sản phẩm "iPhone 15" thành công.'),
    ).toBeInTheDocument();
  });

  it('opens the edit modal prefilled with the selected product', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByTitle('Chỉnh sửa')[1]);

    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue('iPhone 14');
  });
});
