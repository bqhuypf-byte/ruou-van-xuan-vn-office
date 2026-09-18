import { describe, expect, it } from 'vitest';
import type { ProductVariant } from '../types/variant.types';
import { buildRows, reconcileRows } from '../utils/variantMatrix.utils';

const variant = (
  id: number,
  value: string,
  price: string,
  attributeName = 'Độ',
): ProductVariant => ({
  id,
  productId: 1,
  sku: `SKU-${id}`,
  attributes: { [attributeName]: value },
  price,
  salePrice: null,
  stockQuantity: id,
  imageUrl: null,
});

describe('VariantMatrixTable row reconciliation', () => {
  it('keeps prices attached to option values after reordering', () => {
    const rows = buildRows(
      [{ name: 'Độ', values: ['50 độ', '30 độ', '40 độ'] }],
      [variant(1, '30 độ', '30000'), variant(2, '40 độ', '40000'), variant(3, '50 độ', '50000')],
      'ruou-gao-10-lit',
    );

    expect(rows.map(({ attributes, price }) => [attributes.Độ, price])).toEqual([
      ['50 độ', '50000'],
      ['30 độ', '30000'],
      ['40 độ', '40000'],
    ]);
  });

  it('matches legacy variants by values instead of row position', () => {
    const rows = buildRows(
      [{ name: 'Độ(Vol)', values: ['40 độ', '30 độ'] }],
      [variant(1, '30 độ', '30000'), variant(2, '40 độ', '40000')],
      'ruou-gao-10-lit',
    );

    expect(rows.map(({ variantId, price }) => [variantId, price])).toEqual([
      [2, '40000'],
      [1, '30000'],
    ]);
  });

  it('inherits parent prices when adding another classification', () => {
    const currentRows = buildRows(
      [{ name: 'Độ', values: ['30 độ', '40 độ'] }],
      [variant(1, '30 độ', '30000'), variant(2, '40 độ', '40000')],
      'ruou-gao-10-lit',
    );
    const rows = reconcileRows(
      currentRows,
      [
        { name: 'Nồng độ', values: ['40 độ', '30 độ'] },
        { name: 'Dung tích', values: ['5 lít', '10 lít'] },
      ],
      [variant(1, '30 độ', '30000'), variant(2, '40 độ', '40000')],
      'ruou-gao-10-lit',
    );

    expect(rows.map(({ attributes, price }) => [attributes['Nồng độ'], price])).toEqual([
      ['40 độ', '40000'],
      ['40 độ', '40000'],
      ['30 độ', '30000'],
      ['30 độ', '30000'],
    ]);
  });
});
