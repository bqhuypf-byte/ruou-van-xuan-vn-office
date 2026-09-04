import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFormModal } from './ProductFormModal';
import type { FlatCategory } from '../hooks/useCategories';

const categoryOptions: FlatCategory[] = [
  {
    id: 1,
    parentId: null,
    name: 'Electronics',
    slug: 'electronics',
    description: null,
    thumbnailUrl: null,
    showInProductSections: true,
    homeSectionTitle: null,
    homeSortOrder: 0,
    homeDisplayStyle: 'grid' as const,    depth: 0,
    parentName: null,
  },
  {
    id: 2,
    parentId: 1,
    name: 'Phones',
    slug: 'phones',
    description: null,
    thumbnailUrl: null,
    showInProductSections: true,
    homeSectionTitle: null,
    homeSortOrder: 0,
    homeDisplayStyle: 'grid' as const,    depth: 1,
    parentName: 'Electronics',
  },
];

describe('ProductFormModal', () => {
  it('renders create title and empty fields', () => {
    render(
      <ProductFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} categoryOptions={categoryOptions} />,
    );

    expect(screen.getByText('Tạo Sản Phẩm Mới')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue('');
  });

  it('requires a category to be selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} categoryOptions={categoryOptions} />,
    );

    await user.type(screen.getByLabelText(/Tên sản phẩm/i), 'iPhone 15');
    await user.type(screen.getByLabelText(/Slug/i), 'iphone-15');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(await screen.findByText('Vui lòng chọn danh mục')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with categoryId converted to a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <ProductFormModal isOpen onClose={onClose} onSubmit={onSubmit} categoryOptions={categoryOptions} />,
    );

    await user.type(screen.getByLabelText(/Tên sản phẩm/i), 'iPhone 15');
    await user.clear(screen.getByLabelText(/Slug/i));
    await user.type(screen.getByLabelText(/Slug/i), 'iphone-15');
    await user.selectOptions(screen.getByLabelText(/Danh Mục/i), '2');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        categoryId: 2,
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: undefined,
        shortDescription: null,
        thumbnailUrl: undefined,
        isActive: true,
        isFeaturedDeal: false,
        dealSortOrder: 0,
        variantAttributes: [],
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not render when isOpen is false', () => {
    render(
      <ProductFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} categoryOptions={categoryOptions} />,
    );

    expect(screen.queryByText('Tạo Sản Phẩm Mới')).not.toBeInTheDocument();
  });
});
