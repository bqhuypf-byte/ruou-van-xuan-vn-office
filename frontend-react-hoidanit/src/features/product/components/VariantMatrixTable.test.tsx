import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VariantMatrixTable } from './VariantMatrixTable';
import type { VariantAttributeGroup } from '../types/product.types';
import type { ProductVariant } from '../types/variant.types';

const variants: ProductVariant[] = [
  {
    id: 1,
    productId: 1,
    sku: 'RUOU-30',
    attributes: { Độ: '30 độ' },
    price: '100000',
    salePrice: null,
    stockQuantity: 10,
    imageUrl: null,
  },
  {
    id: 2,
    productId: 1,
    sku: 'RUOU-40',
    attributes: { Độ: '40 độ' },
    price: '200000',
    salePrice: null,
    stockQuantity: 20,
    imageUrl: null,
  },
];

const initialGroups: VariantAttributeGroup[] = [
  { name: 'Độ', values: ['30 độ', '40 độ'] },
];

describe('VariantMatrixTable', () => {
  it('preserves unsaved row values when a classification value is added', async () => {
    const { rerender } = render(
      <VariantMatrixTable
        productName="Rượu Nếp"
        productSlug="ruou-nep"
        groups={initialGroups}
        variants={variants}
        onChangeState={vi.fn()}
      />,
    );

    const firstRow = screen.getByText('Rượu Nếp 30 độ').closest('tr');
    expect(firstRow).not.toBeNull();
    const firstPriceInput = within(firstRow!).getAllByRole('spinbutton')[0];
    fireEvent.change(firstPriceInput, { target: { value: '323123' } });

    const expandedGroups: VariantAttributeGroup[] = [
      { name: 'Độ', values: ['30 độ', '40 độ', '45 độ'] },
    ];
    rerender(
      <VariantMatrixTable
        productName="Rượu Nếp"
        productSlug="ruou-nep"
        groups={expandedGroups}
        variants={variants}
        onChangeState={vi.fn()}
      />,
    );

    await waitFor(() => {
      const preservedRow = screen.getByText('Rượu Nếp 30 độ').closest('tr');
      expect(within(preservedRow!).getAllByRole('spinbutton')[0]).toHaveValue(323123);
    });
    expect(screen.getByText('Rượu Nếp 45 độ')).toBeInTheDocument();
  });
});
