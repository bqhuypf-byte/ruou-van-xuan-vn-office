import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import {
  emptyProductFormValues,
  ProductClassificationFields,
  type ProductFormData,
} from './ProductFormFields';

const ReorderFixture = () => {
  const form = useForm<ProductFormData>({
    defaultValues: {
      ...emptyProductFormValues(),
      group1: {
        name: 'Độ',
        values: [
          { value: '30 độ', imageUrl: '/30.webp' },
          { value: '40 độ', imageUrl: '/40.webp' },
          { value: '50 độ', imageUrl: '/50.webp' },
          { value: '', imageUrl: '' },
        ],
      },
    },
  });

  return (
    <ProductClassificationFields
      register={form.register}
      control={form.control}
      errors={form.formState.errors}
      setValue={form.setValue}
      hasGroup2={false}
    />
  );
};

describe('ProductClassificationFields option ordering', () => {
  it('moves an option together with its associated form data', async () => {
    const user = userEvent.setup();
    render(<ReorderFixture />);

    await user.click(screen.getByRole('button', { name: 'Di chuyển 50 độ lên trước' }));

    expect(
      screen.getAllByPlaceholderText('Nhập').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['30 độ', '50 độ', '40 độ', '']);
  });
});
