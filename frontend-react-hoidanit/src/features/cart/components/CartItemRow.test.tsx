import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItemRow } from './CartItemRow';
import type { EnrichedCartItem } from '../types/cart.types';

const item: EnrichedCartItem = {
  id: 1,
  cartId: 1,
  productVariantId: 10,
  quantity: 2,
  sku: 'RVX-01',
  attributes: null,
  price: '145000',
  salePrice: null,
  stockQuantity: 20,
  productName: 'Rượu Nếp Vạn Xuân',
  productSlug: null,
  thumbnailUrl: null,
};

describe('CartItemRow', () => {
  it('updates quantity after the customer types a value and presses Enter', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn().mockResolvedValue(true);
    render(<CartItemRow item={item} onQuantityChange={onQuantityChange} onRemove={vi.fn()} />);

    const quantityInput = screen.getAllByLabelText('Nhập số lượng')[0];
    await user.clear(quantityInput);
    await user.type(quantityInput, '12{Enter}');

    expect(onQuantityChange).toHaveBeenCalledWith(12);
  });

  it('caps a typed quantity at the available stock', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn().mockResolvedValue(true);
    render(<CartItemRow item={item} onQuantityChange={onQuantityChange} onRemove={vi.fn()} />);

    const quantityInput = screen.getAllByLabelText('Nhập số lượng')[0];
    await user.clear(quantityInput);
    await user.type(quantityInput, '99');
    await user.tab();

    expect(onQuantityChange).toHaveBeenCalledWith(20);
  });

  it('restores the current quantity when an update fails', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn().mockResolvedValue(false);
    render(<CartItemRow item={item} onQuantityChange={onQuantityChange} onRemove={vi.fn()} />);

    const quantityInputs = screen.getAllByLabelText('Nhập số lượng');
    await user.clear(quantityInputs[0]);
    await user.type(quantityInputs[0], '5{Enter}');

    expect(quantityInputs[0]).toHaveValue('2');
    expect(quantityInputs[1]).toHaveValue('2');
  });
});
