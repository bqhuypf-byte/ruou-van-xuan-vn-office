import { fireEvent, render, screen } from '@testing-library/react';
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
    render(<ReorderFixture />);

    const sourceHandle = screen.getByRole('button', { name: 'Kéo để di chuyển 50 độ' });
    const targetHandle = screen.getByRole('button', { name: 'Kéo để di chuyển 40 độ' });
    const targetRow = targetHandle.closest('[data-option-row]');
    const dataTransfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: () => undefined,
      getData: () => '2',
    };

    fireEvent.dragStart(sourceHandle, { dataTransfer });
    fireEvent.dragOver(targetRow!, { dataTransfer });
    fireEvent.drop(targetRow!, { dataTransfer });

    expect(
      screen.getAllByPlaceholderText('Nhập').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['30 độ', '50 độ', '40 độ', '']);
  });
});
