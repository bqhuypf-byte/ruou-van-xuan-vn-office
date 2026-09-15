import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product.types';
import { buildProductMetaDescription, buildProductSeoTitle } from './productSeo.utils';

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
  it('prefers the dedicated Admin-managed SEO description', () => {
    const product = createProduct({
      seoDescription: 'Mô tả riêng cho Google.',
      shortDescription: 'Mô tả ngắn trên thẻ.',
    });

    expect(buildProductMetaDescription(product)).toBe('Mô tả riêng cho Google.');
  });

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

describe('buildProductSeoTitle', () => {
  it('uses the dedicated SEO title without adding boilerplate', () => {
    const product = createProduct({ seoTitle: 'Rượu Nếp 40 Độ 1 Lít Vạn Xuân' });
    expect(buildProductSeoTitle(product, 'Rượu Vạn Xuân')).toBe(
      'Rượu Nếp 40 Độ 1 Lít Vạn Xuân',
    );
  });

  it('falls back to the product name and site name', () => {
    expect(buildProductSeoTitle(createProduct(), 'Rượu Vạn Xuân')).toBe(
      'Rượu Nếp Vạn Xuân | Rượu Vạn Xuân',
    );
  });
});
