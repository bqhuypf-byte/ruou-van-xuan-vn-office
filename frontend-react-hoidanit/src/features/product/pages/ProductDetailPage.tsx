import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Plus, AlertCircle, ImageOff } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { VariantTable } from '../components/VariantTable';
import { VariantFormModal } from '../components/VariantFormModal';
import type { VariantFormSubmitData } from '../components/VariantFormModal';
import { ImageGallery } from '../components/ImageGallery';
import { ImageAddModal } from '../components/ImageAddModal';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCreateVariant, useUpdateVariant } from '../hooks/useVariantMutations';
import { useAddImages, useDeleteImage } from '../hooks/useImageMutations';
import type { ProductVariant } from '../types/variant.types';
import type { ProductImage } from '../types/image.types';
import { ROUTES } from '@/routes/routes';

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProductDetail(slug);

  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const [isImageAddOpen, setIsImageAddOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const addImages = useAddImages();
  const deleteImage = useDeleteImage();

  const handleOpenCreateVariant = () => {
    setSelectedVariant(null);
    setIsVariantFormOpen(true);
  };

  const handleOpenEditVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsVariantFormOpen(true);
  };

  const handleSaveVariant = async (data: VariantFormSubmitData) => {
    if (!product) return;
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

  const handleAddImage = async (imageUrl: string) => {
    if (!product) return;
    setFeedback(null);
    try {
      await addImages.mutateAsync({
        productId: product.id,
        input: { images: [{ imageUrl }] },
      });
      setFeedback({ type: 'success', message: 'Đã thêm hình ảnh thành công.' });
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        to={ROUTES.ADMIN_PRODUCTS}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="flex items-center gap-4">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <ImageOff className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{product.slug}</p>
        </div>
      </div>

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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Biến Thể (Variants)</h2>
          <Button size="sm" onClick={handleOpenCreateVariant} leftIcon={<Plus className="w-4 h-4" />}>
            Thêm Biến Thể
          </Button>
        </div>
        <VariantTable
          variants={product.variants}
          isLoading={false}
          onEdit={handleOpenEditVariant}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hình Ảnh (Images)</h2>
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
      </section>

      <VariantFormModal
        isOpen={isVariantFormOpen}
        onClose={() => setIsVariantFormOpen(false)}
        onSubmit={handleSaveVariant}
        variantToEdit={selectedVariant}
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
