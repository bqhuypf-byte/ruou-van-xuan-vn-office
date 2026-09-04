import { describe, expect, it } from 'vitest';
import { findVariantForAttributes, getAttributeOptionImage } from '../utils/variantImage.utils';
import type { ProductDetail } from '../services/product.service';

const product: ProductDetail = {
  id: 1,
  categoryId: 1,
  name: 'Điện thoại',
  slug: 'dien-thoai',
  description: null,
  shortDescription: null,
  thumbnailUrl: null,
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: 0,
  variantAttributes: [
    {
      name: 'Màu sắc',
      values: ['Black', 'Rose'],
      images: { Rose: 'https://example.com/rose-configured.jpg' },
    },
  ],
  variants: [
    {
      id: 10,
      productId: 1,
      sku: 'PHONE-BLACK',
      attributes: { 'Màu sắc': 'Black' },
      price: '100.00',
      salePrice: null,
      stockQuantity: 2,
      imageUrl: 'https://example.com/black.jpg',
    },
    {
      id: 11,
      productId: 1,
      sku: 'PHONE-ROSE',
      attributes: { 'Màu sắc': 'Rose' },
      price: '110.00',
      salePrice: null,
      stockQuantity: 3,
      imageUrl: 'https://example.com/rose-variant.jpg',
    },
  ],
  images: [],
};

describe('product variant image selection', () => {
  it('finds the variant matching the selected attributes', () => {
    const variant = findVariantForAttributes(
      product.variants,
      ['Màu sắc'],
      { 'Màu sắc': ['Black', 'Rose'] },
      { 'Màu sắc': 'Rose' },
    );

    expect(variant?.id).toBe(11);
  });

  it('uses the Admin-configured option image before the variant fallback', () => {
    expect(getAttributeOptionImage(product, 'Màu sắc', 'Rose')).toBe(
      'https://example.com/rose-configured.jpg',
    );
    expect(getAttributeOptionImage(product, 'Màu sắc', 'Black')).toBe(
      'https://example.com/black.jpg',
    );
  });
});
