import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProductDetailPage } from './ProductDetailPage';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCreateVariant, useUpdateVariant } from '../hooks/useVariantMutations';
import { useAddImages, useDeleteImage } from '../hooks/useImageMutations';
import type { ProductDetail } from '../services/product.service';

vi.mock('../hooks/useProductDetail');
vi.mock('../hooks/useVariantMutations');
vi.mock('../hooks/useImageMutations');

const mockDetail: ProductDetail = {
  id: 1,
  categoryId: 2,
  name: 'iPhone 15',
  slug: 'iphone-15',
  description: null,
  thumbnailUrl: null,
  isActive: true,
  variants: [
    { id: 10, productId: 1, sku: 'IP15-BLK-128', color: 'Black', size: '128GB', price: '999.99', salePrice: null, stockQuantity: 50 },
  ],
  images: [{ id: 20, productId: 1, imageUrl: 'https://example.com/a.jpg', sortOrder: 0 }],
};

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/products/iphone-15']}>
      <Routes>
        <Route path="/admin/products/:slug" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.mocked(useProductDetail).mockReturnValue({
      data: mockDetail,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProductDetail>);

    vi.mocked(useCreateVariant).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateVariant>,
    );
    vi.mocked(useUpdateVariant).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateVariant>,
    );
    vi.mocked(useAddImages).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useAddImages>,
    );
    vi.mocked(useDeleteImage).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteImage>,
    );
  });

  it('renders the product name, variants, and images', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'iPhone 15' })).toBeInTheDocument();
    expect(screen.getByText('IP15-BLK-128')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Hình ảnh sản phẩm #20' })).toHaveAttribute(
      'src',
      'https://example.com/a.jpg',
    );
  });

  it('shows an error state with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useProductDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Not found'),
      refetch,
    } as unknown as ReturnType<typeof useProductDetail>);

    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText(/Không thể tải sản phẩm/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('creates a new variant via the form modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateVariant).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateVariant>);

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Thêm Biến Thể/i }));
    await user.type(screen.getByLabelText(/SKU/i), 'IP15-WHT-256');
    await user.type(screen.getByLabelText(/Giá Gốc/i), '1099');
    await user.click(screen.getByRole('button', { name: 'Thêm Mới' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        productId: 1,
        input: { sku: 'IP15-WHT-256', color: undefined, size: undefined, price: 1099, salePrice: undefined, stockQuantity: 0 },
      }),
    );
    expect(await screen.findByText('Đã thêm biến thể "IP15-WHT-256".')).toBeInTheDocument();
  });

  it('adds a new image via the add image modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useAddImages).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useAddImages>);

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Thêm Ảnh/i }));
    await user.type(screen.getByLabelText(/URL Hình Ảnh/i), 'https://example.com/b.jpg');
    const submitButtons = screen.getAllByRole('button', { name: 'Thêm Ảnh' });
    await user.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        productId: 1,
        input: { images: [{ imageUrl: 'https://example.com/b.jpg' }] },
      }),
    );
    expect(await screen.findByText('Đã thêm hình ảnh thành công.')).toBeInTheDocument();
  });
});
