import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { slugify } from '@/shared/utils/slugify';
import { VariantTable } from '../components/VariantTable';
import { VariantMatrixTable } from '../components/VariantMatrixTable';
import type { VariantMatrixSaveRow } from '../components/VariantMatrixTable';
import { VariantFormModal } from '../components/VariantFormModal';
import type { VariantFormSubmitData } from '../components/VariantFormModal';
import {
  productSchema,
  productFormValuesFrom,
  buildProductSubmitPayload,
  variantGroupsFromForm,
  ProductBasicInfoFields,
  ProductDescriptionField,
  ProductClassificationFields,
  type ProductFormData,
} from '../components/ProductFormFields';
import { ImageGallery } from '../components/ImageGallery';
import { ImageAddModal } from '../components/ImageAddModal';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCategories } from '../hooks/useCategories';
import type { FlatCategory } from '../hooks/useCategories';
import { useUpdateProduct } from '../hooks/useProductMutations';
import { useCreateVariant, useUpdateVariant } from '../hooks/useVariantMutations';
import { useAddImages, useDeleteImage } from '../hooks/useImageMutations';
import type { ProductVariant } from '../types/variant.types';
import type { ProductImage } from '../types/image.types';
import type { ProductDetail } from '../services/product.service';
import { ROUTES } from '@/routes/routes';

type TabKey = 'info' | 'description' | 'images' | 'variants';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: 'Thông Tin Sản Phẩm' },
  { key: 'description', label: 'Mô Tả Chi Tiết' },
  { key: 'images', label: 'Hình Ảnh' },
  { key: 'variants', label: 'Biến Thể Sản Phẩm' },
];

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProductDetail(slug);
  const { allCategories } = useCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải sản phẩm ({error instanceof Error ? error.message : 'Không tìm thấy'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      </div>
    );
  }

  // Keyed by product.id so switching to a different product's edit page fully
  // remounts the form (fresh useForm + defaultValues) instead of relying on an
  // imperative reset()-after-mount, which in this codebase has repeatedly proven
  // unreliable at actually refreshing already-rendered input DOM nodes.
  return <ProductEditForm key={product.id} product={product} allCategories={allCategories} />;
};

interface ProductEditFormProps {
  product: ProductDetail;
  allCategories: FlatCategory[];
}

const ProductEditForm = ({ product, allCategories }: ProductEditFormProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const [isImageAddOpen, setIsImageAddOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isSavingMatrix, setIsSavingMatrix] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const updateProduct = useUpdateProduct();
  const addImages = useAddImages();
  const deleteImage = useDeleteImage();

  const {
    register: registerProduct,
    control: productControl,
    handleSubmit: handleProductSubmit,
    setValue: setProductValue,
    watch: watchProduct,
    formState: { errors: productErrors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: productFormValuesFrom(product),
  });
  const hasGroup2 = watchProduct('hasGroup2');
  const nameValue = watchProduct('name');
  const slugValue = watchProduct('slug');

  // Auto-generate the slug from the name while the Slug field is empty — mirrors
  // the category form's behavior. Only kicks in when slug has no value, so it
  // never silently rewrites the slug of an already-saved, already-linked product.
  useEffect(() => {
    (window as unknown as { __slugDebug?: unknown[] }).__slugDebug ??= [];
    (window as unknown as { __slugDebug: unknown[] }).__slugDebug.push({ nameValue, slugValue });
    if (slugValue) return;
    const generatedSlug = slugify(nameValue || '');
    if (!generatedSlug) return;
    setProductValue('slug', generatedSlug);
  }, [nameValue, slugValue, setProductValue]);

  const watchedGroup1 = useWatch({ control: productControl, name: 'group1' });
  const watchedGroup2 = useWatch({ control: productControl, name: 'group2' });
  const formVariantGroups = variantGroupsFromForm({
    group1: watchedGroup1 ?? { name: '', values: [] },
    hasGroup2,
    group2: watchedGroup2 ?? { name: '', values: [] },
  });

  const handleSaveProductInfo = async (data: ProductFormData) => {
    setFeedback(null);
    try {
      await updateProduct.mutateAsync({ id: product.id, input: buildProductSubmitPayload(data) });
      setFeedback({ type: 'success', message: 'Đã cập nhật thông tin sản phẩm.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu sản phẩm.'),
      });
    }
  };

  const handleOpenCreateVariant = () => {
    setSelectedVariant(null);
    setIsVariantFormOpen(true);
  };

  const handleOpenEditVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsVariantFormOpen(true);
  };

  const handleSaveMatrix = async (rows: VariantMatrixSaveRow[]) => {
    setFeedback(null);
    setIsSavingMatrix(true);
    try {
      const results = await Promise.allSettled(
        rows.map((row) =>
          row.variantId
            ? updateVariant.mutateAsync({
                id: row.variantId,
                input: {
                  sku: row.sku,
                  price: row.price,
                  salePrice: row.salePrice,
                  stockQuantity: row.stockQuantity,
                  imageUrl: row.imageUrl,
                },
              })
            : createVariant.mutateAsync({
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
      );
      const failedCount = results.filter((r) => r.status === 'rejected').length;
      const succeededCount = rows.length - failedCount;
      if (failedCount === 0) {
        setFeedback({ type: 'success', message: `Đã lưu ${succeededCount} biến thể thành công.` });
      } else {
        setFeedback({
          type: 'error',
          message: `Đã lưu ${succeededCount} biến thể, ${failedCount} biến thể thất bại.`,
        });
      }
    } finally {
      setIsSavingMatrix(false);
    }
  };

  const handleSaveVariant = async (data: VariantFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedVariant) {
        await updateVariant.mutateAsync({ id: selectedVariant.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật biến thể "${data.sku}".` });
      } else {
        await createVariant.mutateAsync({ productId: product.id, input: data });
        setFeedback({ type: 'success', message: `Đã thêm biến thể "${data.sku}".` });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu biến thể.'),
      });
    }
  };

  const handleAddImage = async (imageUrls: string[]) => {
    setFeedback(null);
    try {
      await addImages.mutateAsync({
        productId: product.id,
        input: { images: imageUrls.map((imageUrl) => ({ imageUrl })) },
      });
      setFeedback({
        type: 'success',
        message:
          imageUrls.length > 1
            ? `Đã thêm ${imageUrls.length} hình ảnh thành công.`
            : 'Đã thêm hình ảnh thành công.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi thêm hình ảnh.'),
      });
    }
  };

  const handleDeleteImage = async (image: ProductImage) => {
    setFeedback(null);
    setDeletingImageId(image.id);
    try {
      await deleteImage.mutateAsync(image.id);
      setFeedback({ type: 'success', message: 'Đã xóa hình ảnh thành công.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa hình ảnh.'),
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const hasVariantGroups = formVariantGroups.length > 0;
  const savedGroupsSignature = JSON.stringify(product.variantAttributes ?? []);
  const formGroupsSignature = JSON.stringify(formVariantGroups);
  const hasUnsavedGroups = hasVariantGroups && formGroupsSignature !== savedGroupsSignature;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        to={ROUTES.ADMIN_PRODUCTS}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách sản phẩm
      </Link>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-medium hover:underline ml-4">
            Đóng
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 px-3 sm:px-5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-3.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleProductSubmit(handleSaveProductInfo)}>
          <div className="p-4 sm:p-6">
            {activeTab === 'info' && (
              <div className="space-y-5">
                <ProductBasicInfoFields
                  register={registerProduct}
                  control={productControl}
                  errors={productErrors}
                  categoryOptions={allCategories}
                />
              </div>
            )}

            {activeTab === 'description' && (
              <div className="space-y-5">
                <ProductDescriptionField control={productControl} errors={productErrors} />
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hình Ảnh Sản Phẩm</h2>
                  <Button size="sm" onClick={() => setIsImageAddOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Thêm Ảnh
                  </Button>
                </div>
                <ImageGallery
                  images={product.images}
                  isLoading={false}
                  onDelete={handleDeleteImage}
                  deletingId={deletingImageId}
                />
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <ProductClassificationFields
                  register={registerProduct}
                  control={productControl}
                  errors={productErrors}
                  setValue={setProductValue}
                  hasGroup2={hasGroup2}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Giá & Tồn Kho</h2>
                    {!hasVariantGroups && (
                      <Button size="sm" onClick={handleOpenCreateVariant} leftIcon={<Plus className="w-4 h-4" />}>
                        Thêm Biến Thể
                      </Button>
                    )}
                  </div>
                  {hasUnsavedGroups && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                      Bảng bên dưới đang xem trước theo phân loại vừa nhập. Bấm "Lưu Chỉnh Sửa" để lưu phân
                      loại, sau đó bấm "Lưu Tất Cả" để lưu giá/tồn kho.
                    </p>
                  )}
                  {hasVariantGroups ? (
                    <VariantMatrixTable
                      productName={product.name}
                      productSlug={product.slug}
                      groups={formVariantGroups}
                      variants={product.variants}
                      isSaving={isSavingMatrix}
                      onSaveAll={handleSaveMatrix}
                    />
                  ) : (
                    <VariantTable variants={product.variants} isLoading={false} onEdit={handleOpenEditVariant} />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" isLoading={updateProduct.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Lưu Chỉnh Sửa
            </Button>
          </div>
        </form>
      </div>

      <VariantFormModal
        isOpen={isVariantFormOpen}
        onClose={() => setIsVariantFormOpen(false)}
        onSubmit={handleSaveVariant}
        variantToEdit={selectedVariant}
        productSlug={product.slug}
        attributeNames={[]}
        isLoading={createVariant.isPending || updateVariant.isPending}
      />

      <ImageAddModal
        isOpen={isImageAddOpen}
        onClose={() => setIsImageAddOpen(false)}
        onSubmit={handleAddImage}
        isLoading={addImages.isPending}
      />
    </div>
  );
};
