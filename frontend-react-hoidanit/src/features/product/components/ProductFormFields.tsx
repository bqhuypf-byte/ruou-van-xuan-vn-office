import { useRef, useState } from 'react';
import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Package, Link2, Plus, Tags, Trash2, Upload, X } from 'lucide-react';
import { Button, ImageDropzone, Input, RichTextEditor } from '@/shared/components/ui';
import { uploadService } from '@/shared/services/upload.service';
import type { Product, VariantAttributeGroup } from '../types/product.types';
import type { FlatCategory } from '../hooks/useCategories';

const valueOptionSchema = z.object({ value: z.string(), imageUrl: z.string().optional() });
const groupSchema = z.object({
  name: z.string(),
  values: z.array(valueOptionSchema),
});

export const productSchema = z.object({
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  name: z
    .string()
    .min(1, 'Tên sản phẩm không được để trống')
    .max(255, 'Tên sản phẩm tối đa 255 ký tự'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .max(255, 'Slug tối đa 255 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)'),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean(),
  isFeaturedDeal: z.boolean(),
  dealSortOrder: z.string().optional(),
  group1: groupSchema,
  hasGroup2: z.boolean(),
  group2: groupSchema,
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormSubmitData {
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  isFeaturedDeal: boolean;
  dealSortOrder?: number;
  variantAttributes?: VariantAttributeGroup[];
}

const emptyGroup = () => ({ name: '', values: [{ value: '', imageUrl: '' }] });

const groupFromProduct = (group: VariantAttributeGroup | undefined) =>
  group
    ? {
        name: group.name,
        values: [
          ...group.values.map((value) => ({ value, imageUrl: group.images?.[value] ?? '' })),
          { value: '', imageUrl: '' },
        ],
      }
    : emptyGroup();

export const emptyProductFormValues = (): ProductFormData => ({
  categoryId: '',
  name: '',
  slug: '',
  description: '',
  thumbnailUrl: '',
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: '0',
  group1: emptyGroup(),
  hasGroup2: false,
  group2: emptyGroup(),
});

export const productFormValuesFrom = (product: Product): ProductFormData => {
  const groups = product.variantAttributes ?? [];
  return {
    categoryId: String(product.categoryId),
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    thumbnailUrl: product.thumbnailUrl ?? '',
    isActive: product.isActive,
    isFeaturedDeal: product.isFeaturedDeal,
    dealSortOrder: String(product.dealSortOrder ?? 0),
    group1: groupFromProduct(groups[0]),
    hasGroup2: Boolean(groups[1]),
    group2: groupFromProduct(groups[1]),
  };
};

const buildVariantGroup = (group: ProductFormData['group1']): VariantAttributeGroup | null => {
  const name = (group.name ?? '').trim();
  const values = (group.values ?? [])
    .map((v) => (v.value ?? '').trim())
    .filter(Boolean);
  if (!name || values.length === 0) return null;

  const images: Record<string, string> = {};
  for (const v of group.values) {
    const trimmed = v.value.trim();
    if (trimmed && v.imageUrl) images[trimmed] = v.imageUrl;
  }

  return { name, values, ...(Object.keys(images).length > 0 ? { images } : {}) };
};

/** Live variant-attribute groups derived from the current form state — used to preview the
 * price/stock matrix before the product is saved. */
export const variantGroupsFromForm = (
  data: Pick<ProductFormData, 'group1' | 'hasGroup2' | 'group2'>,
): VariantAttributeGroup[] =>
  [buildVariantGroup(data.group1), data.hasGroup2 ? buildVariantGroup(data.group2) : null].filter(
    (g): g is VariantAttributeGroup => g !== null,
  );

export const buildProductSubmitPayload = (data: ProductFormData): ProductFormSubmitData => {
  const variantAttributes = variantGroupsFromForm(data);

  return {
    categoryId: Number(data.categoryId),
    name: data.name,
    slug: data.slug,
    description: data.description || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    isActive: data.isActive,
    isFeaturedDeal: data.isFeaturedDeal,
    dealSortOrder: data.dealSortOrder ? Number(data.dealSortOrder) : undefined,
    variantAttributes,
  };
};

const OptionImageThumb = ({ value, onChange }: { value?: string; onChange: (url: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => !isUploading && inputRef.current?.click()}
      title="Ảnh cho tùy chọn này"
      className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-brand-400 transition-colors"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {isUploading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
      ) : value ? (
        <img src={value} alt="" className="w-full h-full object-cover" />
      ) : (
        <Upload className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

interface ClassificationGroupEditorProps {
  title: string;
  namePrefix: 'group1' | 'group2';
  showImages?: boolean;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  register: UseFormRegister<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  onRemove?: () => void;
}

const ClassificationGroupEditor = ({
  title,
  namePrefix,
  showImages = false,
  control,
  errors,
  register,
  setValue,
  onRemove,
}: ClassificationGroupEditorProps) => {
  const { fields, append, remove } = useFieldArray({ control, name: `${namePrefix}.values` });

  const handleValueChange = (index: number, value: string) => {
    const isLast = index === fields.length - 1;
    if (isLast && value.trim() !== '') {
      append({ value: '', imageUrl: '' });
    }
  };

  const handleRemoveValue = (index: number) => {
    if (fields.length <= 1) {
      setValue(`${namePrefix}.values.${index}.value`, '');
      setValue(`${namePrefix}.values.${index}.imageUrl`, '');
      return;
    }
    remove(index);
  };

  return (
    <div className="space-y-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400 shrink-0">{title}</p>
        {onRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} title="Xóa phân loại này">
            <X className="w-4 h-4 text-slate-400" />
          </Button>
        )}
      </div>
      <Input placeholder="Ví dụ: Màu sắc" error={errors[namePrefix]?.name?.message} {...register(`${namePrefix}.name`)} />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Tùy chọn <span className="text-rose-500">*</span>
        {showImages && ' — bấm vào ảnh để gắn ảnh riêng cho từng tùy chọn (dùng luôn cho bảng biến thể)'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1.5">
            {showImages && (
              <Controller
                control={control}
                name={`${namePrefix}.values.${index}.imageUrl` as const}
                render={({ field: imageField }) => (
                  <OptionImageThumb value={imageField.value} onChange={imageField.onChange} />
                )}
              />
            )}
            <Input
              placeholder="Nhập"
              error={errors[namePrefix]?.values?.[index]?.value?.message}
              {...register(`${namePrefix}.values.${index}.value` as const, {
                onChange: (e) => handleValueChange(index, e.target.value),
              })}
            />
            {index < fields.length - 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveValue(index)}
                title="Xóa tùy chọn"
              >
                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface ProductBasicInfoFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  categoryOptions: FlatCategory[];
  onSlugManualEdit?: () => void;
}

export const ProductBasicInfoFields = ({
  register,
  control,
  errors,
  categoryOptions,
  onSlugManualEdit,
}: ProductBasicInfoFieldsProps) => (
  <>
    <Input
      label="Tên sản phẩm"
      placeholder="Ví dụ: iPhone 15"
      leftIcon={<Package className="w-4 h-4" />}
      error={errors.name?.message}
      {...register('name')}
    />

    <Input
      label="Slug"
      placeholder="vi-du: iphone-15"
      leftIcon={<Link2 className="w-4 h-4" />}
      error={errors.slug?.message}
      helperText="Tự động sinh theo tên, có thể sửa tay."
      {...register('slug', { onChange: onSlugManualEdit })}
    />

    <div className="w-full space-y-1.5">
      <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Danh Mục
      </label>
      <select
        id="categoryId"
        className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
        {...register('categoryId')}
      >
        <option value="">-- Chọn danh mục --</option>
        {categoryOptions.map((category) => (
          <option key={category.id} value={category.id}>
            {'—'.repeat(category.depth)} {category.name}
          </option>
        ))}
      </select>
      {errors.categoryId && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.categoryId.message}</p>}
    </div>

    <Controller
      name="thumbnailUrl"
      control={control}
      render={({ field }) => (
        <ImageDropzone label="Ảnh Đại Diện" value={field.value} onChange={field.onChange} error={errors.thumbnailUrl?.message} />
      )}
    />

    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      <input
        type="checkbox"
        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
        {...register('isActive')}
      />
      Đang bán (hiển thị cho khách hàng)
    </label>

    <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
          {...register('isFeaturedDeal')}
        />
        Hiển thị ở mục "Deal Nổi Bật" (Grab the best deal) trang chủ
      </label>
      <Input
        label="Thứ tự hiển thị Deal"
        type="number"
        placeholder="0"
        helperText="Số nhỏ hơn hiển thị trước"
        {...register('dealSortOrder')}
      />
    </div>
  </>
);

export interface ProductDescriptionFieldProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const ProductDescriptionField = ({ control, errors }: ProductDescriptionFieldProps) => (
  <Controller
    name="description"
    control={control}
    render={({ field }) => (
      <RichTextEditor
        label="Mô Tả Chi Tiết"
        value={field.value ?? ''}
        onChange={field.onChange}
        error={errors.description?.message}
      />
    )}
  />
);

export interface ProductClassificationFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  hasGroup2: boolean;
}

export const ProductClassificationFields = ({
  register,
  control,
  errors,
  setValue,
  hasGroup2,
}: ProductClassificationFieldsProps) => (
  <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Tags className="w-4 h-4" />
        Phân Loại Hàng
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        Đặt tên phân loại và liệt kê tất cả tùy chọn giá trị (ví dụ: Màu sắc → Đen, Trắng, Vàng), kèm ảnh
        riêng cho Phân Loại 1 nếu cần. Hệ thống sẽ tự sinh bảng biến thể (giá / tồn kho / SKU) bên dưới là
        tổ hợp giữa Phân Loại 1 và Phân Loại 2.
      </p>
    </div>

    <ClassificationGroupEditor
      title="Phân loại 1"
      namePrefix="group1"
      showImages
      control={control}
      errors={errors}
      register={register}
      setValue={setValue}
    />

    {hasGroup2 ? (
      <ClassificationGroupEditor
        title="Phân loại 2"
        namePrefix="group2"
        control={control}
        errors={errors}
        register={register}
        setValue={setValue}
        onRemove={() => {
          setValue('hasGroup2', false);
          setValue('group2', emptyGroup());
        }}
      />
    ) : (
      <Button type="button" variant="outline" size="sm" onClick={() => setValue('hasGroup2', true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
        Thêm Phân Loại 2
      </Button>
    )}
  </div>
);

export interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  hasGroup2: boolean;
  categoryOptions: FlatCategory[];
  onSlugManualEdit?: () => void;
}

/** Combines all product form field groups in one continuous scroll — used by the quick-create modal. */
export const ProductFormFields = ({
  register,
  control,
  errors,
  setValue,
  hasGroup2,
  categoryOptions,
  onSlugManualEdit,
}: ProductFormFieldsProps) => (
  <>
    <ProductBasicInfoFields
      register={register}
      control={control}
      errors={errors}
      categoryOptions={categoryOptions}
      onSlugManualEdit={onSlugManualEdit}
    />
    <ProductDescriptionField control={control} errors={errors} />
    <ProductClassificationFields
      register={register}
      control={control}
      errors={errors}
      setValue={setValue}
      hasGroup2={hasGroup2}
    />
  </>
);
