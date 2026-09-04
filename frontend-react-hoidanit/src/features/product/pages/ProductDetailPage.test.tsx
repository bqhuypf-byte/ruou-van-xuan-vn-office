import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProductDetailPage } from './ProductDetailPage';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCategories } from '../hooks/useCategories';
import { useCreateVariant, useUpdateVariant } from '../hooks/useVariantMutations';
import { useUpdateProduct } from '../hooks/useProductMutations';
import { useAddImages, useDeleteImage, useReorderImages } from '../hooks/useImageMutations';
import type { ProductDetail } from '../services/product.service';

vi.mock('../hooks/useProductDetail');
vi.mock('../hooks/useCategories');
vi.mock('../hooks/useVariantMutations');
vi.mock('../hooks/useProductMutations');
vi.mock('../hooks/useImageMutations');
vi.mock('../components/MultiImageDropzone', () => ({
  MultiImageDropzone: ({
    onUploadedUrlsChange,
  }: {
    onUploadedUrlsChange: (urls: string[]) => void;
  }) => (
    <button
      type="button"
      onClick={() => onUploadedUrlsChange(['https://example.com/b.jpg'])}
    >
      Chọn ảnh kiểm thử
    </button>
  ),
}));

const mockDetail: ProductDetail = {
  id: 1,
  categoryId: 2,
  name: 'iPhone 15',
  slug: 'iphone-15',
  description: null,
  shortDescription: null,
  thumbnailUrl: null,
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: 0,
  variantAttributes: null,
  variants: [
    {
      id: 10,
      productId: 1,
      sku: 'IP15-BLK-128',
      attributes: { 'Màu Sắc': 'Black', 'Kích Cỡ': '128GB' },
      price: '999.99',
      salePrice: null,
      stockQuantity: 50,
      imageUrl: null,
    },
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

    vi.mocked(useCategories).mockReturnValue({
      allCategories: [],
    } as unknown as ReturnType<typeof useCategories>);

    vi.mocked(useCreateVariant).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateVariant>,
    );
    vi.mocked(useUpdateVariant).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateVariant>,
    );
    vi.mocked(useUpdateProduct).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateProduct>,
    );
    vi.mocked(useAddImages).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useAddImages>,
    );
    vi.mocked(useDeleteImage).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteImage>,
    );
    vi.mocked(useReorderImages).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useReorderImages>,
    );
  });

  it('renders the product name, variants, and images', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue('iPhone 15');

    await user.click(screen.getByRole('button', { name: 'Biến Thể Sản Phẩm' }));
    expect(screen.getByText('IP15-BLK-128')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hình Ảnh' }));
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

    await user.click(screen.getByRole('button', { name: 'Biến Thể Sản Phẩm' }));
    await user.click(screen.getByRole('button', { name: /Thêm Biến Thể/i }));
    await user.clear(screen.getByLabelText(/SKU/i));
    await user.type(screen.getByLabelText(/SKU/i), 'IP15-WHT-256');
    await user.type(screen.getByLabelText(/Giá Gốc/i), '1099');
    await user.click(screen.getByRole('button', { name: 'Thêm Mới' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        productId: 1,
        input: { sku: 'IP15-WHT-256', attributes: undefined, price: 1099, salePrice: undefined, stockQuantity: 0 },
      }),
    );
    expect(await screen.findByText('Đã thêm biến thể "IP15-WHT-256".')).toBeInTheDocument();
  });

  it('auto-generates the price/stock matrix when a classification option is typed', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Biến Thể Sản Phẩm' }));
    // Old empty-variant table initially
    expect(screen.queryByText('Danh sách phân loại hàng')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Ví dụ: Màu sắc'), 'Độ');
    await user.type(screen.getAllByPlaceholderText('Nhập')[0], '30 độ');

    expect(await screen.findByText('Danh sách phân loại hàng')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Áp dụng cho tất cả phân loại/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Giá' })).toBeInTheDocument();
    // "Thêm Biến Thể" (old empty-state action) is hidden once the matrix takes over
    expect(screen.queryByRole('button', { name: /Thêm Biến Thể/i })).not.toBeInTheDocument();
  });

  it('adds a new image via the add image modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useAddImages).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useAddImages>);

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Hình Ảnh' }));
    await user.click(screen.getByRole('button', { name: /Thêm Ảnh/i }));
    await user.click(screen.getByRole('button', { name: 'Chọn ảnh kiểm thử' }));
    await user.click(screen.getByRole('button', { name: 'Thêm 1 Ảnh' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        productId: 1,
        input: { images: [{ imageUrl: 'https://example.com/b.jpg' }] },
      }),
    );
    expect(await screen.findByText('Đã thêm hình ảnh thành công.')).toBeInTheDocument();
  });
});
