import { describe, expect, it } from 'vitest';
import type { ProductDetail } from '../services/product.service';
import { buildProductStructuredData } from './ProductStructuredData';

const product = (overrides: Partial<ProductDetail> = {}): ProductDetail => ({
  id: 10,
  categoryId: 1,
  name: 'Rượu Nếp Vạn Xuân 1 Lít',
  slug: 'ruou-nep-van-xuan-1-lit',
  description: '<p>Rượu nếp truyền thống.</p>',
  shortDescription: 'Rượu nếp truyền thống Vạn Xuân.',
  thumbnailUrl: '/uploads/ruou-nep.webp',
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: 0,
  variantAttributes: [{ name: 'Độ(Vol)', values: ['30 độ', '40 độ'] }],
  variants: [
    {
      id: 1,
      productId: 10,
      sku: 'RNVX-30',
      attributes: { 'Độ(Vol)': '30 độ' },
      price: '150000.00',
      salePrice: null,
      stockQuantity: 5,
      imageUrl: null,
    },
    {
      id: 2,
      productId: 10,
      sku: 'RNVX-40',
      attributes: { 'Độ(Vol)': '40 độ' },
      price: '170000.00',
      salePrice: '160000.00',
      stockQuantity: 0,
      imageUrl: null,
    },
  ],
  images: [],
  rating: 4.8,
  reviewCount: 12,
  ...overrides,
});

describe('buildProductStructuredData', () => {
  it('builds ProductGroup markup with one Product and Offer per valid SKU', () => {
    const data = buildProductStructuredData(product(), 'Rượu Vạn Xuân');

    expect(data['@type']).toBe('ProductGroup');
    expect(data.hasVariant).toHaveLength(2);
    expect(data.hasVariant?.[0].sku).toBe('RNVX-30');
    expect(data.hasVariant?.[0].offers.priceCurrency).toBe('VND');
    expect(data.hasVariant?.[1].offers.price).toBe(160000);
    expect(data.hasVariant?.[1].offers.availability).toBe('https://schema.org/OutOfStock');
    expect(data.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 12,
    });
  });

  it('falls back to Product with multiple offers when variant attributes are inconsistent', () => {
    const data = buildProductStructuredData(
      product({ variantAttributes: [{ name: 'Độ(Vol)', values: ['30 độ'] }] }),
    );

    expect(data['@type']).toBe('Product');
    expect(data.offers).toHaveLength(2);
  });
});
