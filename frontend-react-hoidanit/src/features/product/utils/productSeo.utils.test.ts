import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product.types';
import { buildProductMetaDescription } from './productSeo.utils';

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  categoryId: 1,
  name: 'Rượu Nếp Vạn Xuân',
  slug: 'ruou-nep-van-xuan',
  description: null,
  shortDescription: null,
  thumbnailUrl: null,
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: 0,
  ...overrides,
});

describe('buildProductMetaDescription', () => {
  it('prefers the Admin-managed short description', () => {
    const product = createProduct({
      shortDescription: 'Rượu nếp truyền thống, chưng cất tỉ mỉ.',
      description: '<p>Mô tả chi tiết</p>',
    });

    expect(buildProductMetaDescription(product)).toBe(
      'Rượu nếp truyền thống, chưng cất tỉ mỉ.',
    );
  });

  it('falls back to plain text from the detailed description', () => {
    const product = createProduct({
      description: '<p>Hương vị <strong>đậm đà</strong></p>',
    });

    expect(buildProductMetaDescription(product)).toBe('Hương vị đậm đà');
  });

  it('keeps the meta description within 160 characters', () => {
    const product = createProduct({ shortDescription: 'Rượu truyền thống '.repeat(20) });

    expect(buildProductMetaDescription(product).length).toBeLessThanOrEqual(160);
  });
});
