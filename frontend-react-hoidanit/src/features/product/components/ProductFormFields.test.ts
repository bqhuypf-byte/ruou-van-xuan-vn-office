import { describe, expect, it } from 'vitest';
import { variantGroupsFromForm } from './ProductFormFields';

describe('variantGroupsFromForm', () => {
  it('removes duplicate option values while preserving an available image', () => {
    const groups = variantGroupsFromForm({
      group1: {
        name: 'Độ(Vol)',
        values: [
          { value: '40 độ', imageUrl: '' },
          { value: ' 40 ĐỘ ', imageUrl: '/uploads/40-do.webp' },
          { value: '45 độ', imageUrl: '/uploads/45-do.webp' },
        ],
      },
      hasGroup2: false,
      group2: { name: '', values: [] },
    });

    expect(groups).toEqual([
      {
        name: 'Độ(Vol)',
        values: ['40 độ', '45 độ'],
        images: {
          '40 độ': '/uploads/40-do.webp',
          '45 độ': '/uploads/45-do.webp',
        },
      },
    ]);
  });
});
