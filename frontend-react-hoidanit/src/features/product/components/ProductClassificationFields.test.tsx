import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
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
    const elementFromPoint = vi.fn().mockReturnValue(targetRow as Element);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPoint,
    });

    fireEvent.pointerDown(sourceHandle, { button: 0, pointerId: 1 });
    fireEvent.pointerMove(sourceHandle, { pointerId: 1, clientX: 10, clientY: 10 });
    fireEvent.pointerUp(sourceHandle, { pointerId: 1 });

    expect(
      screen.getAllByPlaceholderText('Nhập').map((input) => (input as HTMLInputElement).value),
    ).toEqual(['30 độ', '50 độ', '40 độ', '']);
    Reflect.deleteProperty(document, 'elementFromPoint');
  });
});
