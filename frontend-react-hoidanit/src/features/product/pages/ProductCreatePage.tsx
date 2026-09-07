import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Plus, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { slugify } from '@/shared/utils/slugify';
import {
  buildProductSubmitPayload,
  emptyProductFormValues,
  ProductBasicInfoFields,
  ProductClassificationFields,
  ProductDescriptionField,
  productSchema,
  variantGroupsFromForm,
  type ProductFormData,
} from '../components/ProductFormFields';
import {
  VariantMatrixTable,
  type VariantMatrixChangeState,
} from '../components/VariantMatrixTable';
import { ImageGallery } from '../components/ImageGallery';
import { ImageAddModal } from '../components/ImageAddModal';
import { useCategories } from '../hooks/useCategories';
import { useCreateProduct } from '../hooks/useProductMutations';
import { useCreateVariant } from '../hooks/useVariantMutations';
import { useAddImages } from '../hooks/useImageMutations';
import type { ProductImage } from '../types/image.types';

type TabKey = 'info' | 'description' | 'images' | 'variants';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: 'Thông Tin Sản Phẩm' },
  { key: 'description', label: 'Mô Tả' },
  { key: 'images', label: 'Hình Ảnh' },
  { key: 'variants', label: 'Biến Thể Sản Phẩm' },
];

const EMPTY_MATRIX_STATE: VariantMatrixChangeState = {
  rows: [],
  hasChanges: false,
  hasInvalidRows: false,
};

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { allCategories } = useCategories();
  const createProduct = useCreateProduct();
  const createVariant = useCreateVariant();
  const addImages = useAddImages();
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [isImageAddOpen, setIsImageAddOpen] = useState(false);
  const [pendingImages, setPendingImages] = useState<ProductImage[]>([]);
  const [matrixChangeState, setMatrixChangeState] =
    useState<VariantMatrixChangeState>(EMPTY_MATRIX_STATE);
  const [feedback, setFeedback] = useState<string | null>(null);
  const nextImageId = useRef(-1);
  const isSlugManuallyEdited = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProductFormValues(),
  });

  const [hasGroup2 = false, nameValue = '', slugValue = ''] = useWatch({
    control,
    name: ['hasGroup2', 'name', 'slug'],
  });
  const watchedGroup1 = useWatch({ control, name: 'group1' });
  const watchedGroup2 = useWatch({ control, name: 'group2' });
  const variantGroups = variantGroupsFromForm({
    group1: watchedGroup1 ?? { name: '', values: [] },
    hasGroup2,
    group2: watchedGroup2 ?? { name: '', values: [] },
  });
  const activeMatrixState =
    variantGroups.length > 0 ? matrixChangeState : EMPTY_MATRIX_STATE;

  useEffect(() => {
    if (isSlugManuallyEdited.current || slugValue) return;
    const generatedSlug = slugify(nameValue || '');
    if (generatedSlug) setValue('slug', generatedSlug);
  }, [nameValue, setValue, slugValue]);

  const handleMatrixChange = useCallback((state: VariantMatrixChangeState) => {
    setMatrixChangeState(state);
  }, []);

  const handleAddPendingImages = async (imageUrls: string[]) => {
    setPendingImages((current) => [
      ...current,
      ...imageUrls.map((imageUrl, index) => ({
        id: nextImageId.current--,
        productId: 0,
        imageUrl,
        sortOrder: current.length + index,
      })),
    ]);
  };

  const handleReorderPendingImages = async (imageIds: number[]) => {
    setPendingImages((current) => {
      const byId = new Map(current.map((image) => [image.id, image]));
      return imageIds
        .map((id, sortOrder) => {
          const image = byId.get(id);
          return image ? { ...image, sortOrder } : null;
        })
        .filter((image): image is ProductImage => image !== null);
    });
  };

  const handleCreate = async (data: ProductFormData) => {
    if (activeMatrixState.hasInvalidRows) {
      setFeedback('Vui lòng nhập giá lớn hơn 0 cho tất cả phân loại.');
      setActiveTab('variants');
      return;
    }

    setFeedback(null);
    try {
      const product = await createProduct.mutateAsync(buildProductSubmitPayload(data));

      await Promise.all([
        ...activeMatrixState.rows.map((row) =>
          createVariant.mutateAsync({
            productId: product.id,
            input: {
              sku: row.sku,
              attributes: row.attributes,
              price: row.price,
              salePrice: row.salePrice,
              stockQuantity: row.stockQuantity,
              imageUrl: row.imageUrl,
            },
          }),
        ),
        ...(pendingImages.length > 0
          ? [
              addImages.mutateAsync({
                productId: product.id,
                input: {
                  images: pendingImages.map((image, sortOrder) => ({
                    imageUrl: image.imageUrl,
                    sortOrder,
                  })),
                },
              }),
            ]
          : []),
      ]);

      navigate(ROUTES.ADMIN_PRODUCT_DETAIL.replace(':slug', product.slug));
    } catch (error) {
      setFeedback(getApiErrorMessage(error, 'Có lỗi xảy ra khi tạo sản phẩm.'));
    }
  };

  const isSaving = createProduct.isPending || createVariant.isPending || addImages.isPending;
  const hasChanges = isDirty || activeMatrixState.hasChanges || pendingImages.length > 0;
  const orderedImages = useMemo(
    () => pendingImages.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [pendingImages],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        to={ROUTES.ADMIN_PRODUCTS}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách sản phẩm
      </Link>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 px-3 sm:px-5 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition-colors sm:px-4 ${
                activeTab === tab.key
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(handleCreate)}>
          <div className="p-4 sm:p-6">
            {activeTab === 'info' && (
              <div className="space-y-5">
                <ProductBasicInfoFields
                  register={register}
                  control={control}
                  errors={errors}
                  categoryOptions={allCategories}
                  onSlugManualEdit={() => {
                    isSlugManuallyEdited.current = true;
                  }}
                />
              </div>
            )}

            {activeTab === 'description' && (
              <ProductDescriptionField control={control} errors={errors} />
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Hình Ảnh Sản Phẩm
                  </h2>
                  <Button
                    size="sm"
                    onClick={() => setIsImageAddOpen(true)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Thêm Ảnh
                  </Button>
                </div>
                <ImageGallery
                  images={orderedImages}
                  isLoading={false}
                  onDelete={(image) =>
                    setPendingImages((current) => current.filter((item) => item.id !== image.id))
                  }
                  onReorder={handleReorderPendingImages}
                />
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <ProductClassificationFields
                  register={register}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  hasGroup2={hasGroup2}
                />
                {variantGroups.length > 0 ? (
                  <VariantMatrixTable
                    productName={nameValue || 'Sản phẩm mới'}
                    productSlug={slugValue || 'san-pham-moi'}
                    groups={variantGroups}
                    variants={[]}
                    onChangeState={handleMatrixChange}
                  />
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Thêm phân loại ở phía trên để nhập giá, tồn kho và SKU.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
            <Button
              type="submit"
              disabled={!hasChanges}
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Tạo Sản Phẩm
            </Button>
          </div>
        </form>
      </div>

      <ImageAddModal
        isOpen={isImageAddOpen}
        onClose={() => setIsImageAddOpen(false)}
        onSubmit={handleAddPendingImages}
        isLoading={false}
      />
    </div>
  );
};
