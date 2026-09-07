import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomepageSectionItemRow } from './HomepageSectionItemRow';
import type { HomepageSectionItem } from '../types/homepage-section.types';

const item: HomepageSectionItem = {
  id: 1,
  productId: 10,
  sortOrder: 0,
  badgeText: null,
  overridePrice: null,
  overrideOriginalPrice: null,
  product: {
    id: 10,
    name: 'Rượu Nếp Vạn Xuân',
    slug: 'ruou-nep-van-xuan',
    thumbnailUrl: null,
    price: 40000,
    salePrice: null,
    rating: null,
    reviewCount: 0,
  },
};

describe('HomepageSectionItemRow', () => {
  it('automatically calculates the discount badge from prices', () => {
    const onSave = vi.fn();
    render(
      <HomepageSectionItemRow
        item={item}
        position={1}
        totalCount={1}
        onSave={onSave}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onChangePosition={vi.fn()}
        canMoveUp={false}
        canMoveDown={false}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Giá bán (ghi đè)'), {
      target: { value: '35000' },
    });
    fireEvent.change(screen.getByPlaceholderText('Giá gạch (ghi đè)'), {
      target: { value: '40000' },
    });

    expect(screen.getByPlaceholderText('Tự tính % theo giá')).toHaveValue('-13%');

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
    expect(onSave).toHaveBeenCalledWith({
      overridePrice: 35000,
      overrideOriginalPrice: 40000,
      badgeText: '-13%',
    });
  });
});
