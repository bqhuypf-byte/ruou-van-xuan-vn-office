import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFormModal } from './CategoryFormModal';
import type { FlatCategory } from '../hooks/useCategories';

const parentOptions: FlatCategory[] = [
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

describe('CategoryFormModal', () => {
  it('renders create title and empty fields when no category is being edited', () => {
    render(
      <CategoryFormModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        parentOptions={parentOptions}
      />,
    );

    expect(screen.getByText('Tạo Danh Mục Mới')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên danh mục/i)).toHaveValue('');
  });

  it('prefills fields and shows edit title when editing a category', () => {
    render(
      <CategoryFormModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        parentOptions={parentOptions}
        categoryToEdit={parentOptions[1]}
      />,
    );

    expect(screen.getByText('Chỉnh Sửa Danh Mục')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên danh mục/i)).toHaveValue('Phones');
    expect(screen.getByLabelText(/Slug/i)).toHaveValue('phones');
  });

  it('excludes the category being edited from the parent options', () => {
    render(
      <CategoryFormModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        parentOptions={parentOptions}
        categoryToEdit={parentOptions[0]}
      />,
    );

    const select = screen.getByLabelText(/Danh Mục Cha/i) as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((o) => o.textContent);
    expect(optionLabels.some((label) => label?.includes('Electronics'))).toBe(false);
  });

  it('shows validation errors for empty name and invalid slug', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} parentOptions={parentOptions} />,
    );

    await user.type(screen.getByLabelText(/Slug/i), 'Invalid Slug!');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(
      await screen.findByText('Tên danh mục không được để trống'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)'),
    ).toBeInTheDocument();
  });

  it('submits the form data with parentId converted to a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <CategoryFormModal
        isOpen
        onClose={onClose}
        onSubmit={onSubmit}
        parentOptions={parentOptions}
      />,
    );

    await user.type(screen.getByLabelText(/Tên danh mục/i), 'Laptops');
    await user.type(screen.getByLabelText(/Slug/i), 'laptops');
    await user.selectOptions(screen.getByLabelText(/Danh Mục Cha/i), '1');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Laptops',
        slug: 'laptops',
        parentId: 1,
        showInTopCategories: false,
        showInDailyEssentials: false,
        homeSortOrder: 0,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not render when isOpen is false', () => {
    render(
      <CategoryFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        parentOptions={parentOptions}
      />,
    );

    expect(screen.queryByText('Tạo Danh Mục Mới')).not.toBeInTheDocument();
  });
});
