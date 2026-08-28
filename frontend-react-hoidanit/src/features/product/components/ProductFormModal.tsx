import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal } from '@/shared/components/ui';
import { slugify } from '@/shared/utils/slugify';
import {
  productSchema,
  emptyProductFormValues,
  buildProductSubmitPayload,
  ProductFormFields,
  type ProductFormData,
  type ProductFormSubmitData,
} from './ProductFormFields';
export type { ProductFormSubmitData } from './ProductFormFields';
import type { FlatCategory } from '../hooks/useCategories';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormSubmitData) => Promise<void>;
  categoryOptions: FlatCategory[];
  isLoading?: boolean;
}

/** Creates a new product with just the essentials — full editing (info, phân loại, price/stock, images) happens on the product detail page afterwards. */
export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryOptions,
  isLoading = false,
}: ProductFormModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProductFormValues(),
  });

  const hasGroup2 = watch('hasGroup2');
  const nameValue = watch('name');
  const isSlugManuallyEditedRef = useRef(false);

  useEffect(() => {
    if (isSlugManuallyEditedRef.current) return;
    const generatedSlug = slugify(nameValue || '');
    if (!generatedSlug) return;
    setValue('slug', generatedSlug);
  }, [nameValue, setValue]);

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(buildProductSubmitPayload(data));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Sản Phẩm Mới"
      description="Nhập thông tin để tạo sản phẩm mới"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <ProductFormFields
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          hasGroup2={hasGroup2}
          categoryOptions={categoryOptions}
          onSlugManualEdit={() => {
            isSlugManuallyEditedRef.current = true;
          }}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Tạo Mới
          </Button>
        </div>
      </form>
    </Modal>
  );
};
