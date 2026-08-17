import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { AlertCircle, ImageOff, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Badge, Button, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAddCartItem } from '@/features/cart';
import { ROUTES } from '@/routes/routes';
import { useProductDetail } from '../hooks/useProductDetail';
import { useProductCacheStore } from '../stores/productCache.store';
import type { ProductVariant } from '../types/variant.types';
import type { ProductDetail } from '../services/product.service';

export const ProductViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProductDetail(slug);
  const cacheProductDetail = useProductCacheStore((state) => state.cacheProductDetail);

  useEffect(() => {
    if (product) {
      cacheProductDetail(product);
    }
  }, [product, cacheProductDetail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
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

  return <ProductPurchasePanel key={product.id} product={product} />;
};

const ProductPurchasePanel = ({ product }: { product: ProductDetail }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(
    product.thumbnailUrl ?? product.images[0]?.imageUrl ?? null,
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const addCartItem = useAddCartItem();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setFeedback(null);
    try {
      await addCartItem.mutateAsync({ productVariantId: selectedVariant.id, quantity });
      setFeedback({ type: 'success', message: 'Đã thêm sản phẩm vào giỏ hàng.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Không thể thêm vào giỏ hàng.') });
    }
  };

  const price = selectedVariant ? Number(selectedVariant.salePrice ?? selectedVariant.price) : null;
  const originalPrice = selectedVariant?.salePrice ? Number(selectedVariant.price) : null;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="w-12 h-12 text-slate-400" />
              )}
            </div>
            {product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(image.imageUrl)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                      activeImage === image.imageUrl ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h1>

            {price !== null && (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(price)}
                </span>
                {originalPrice !== null && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {product.variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Chọn phiên bản</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      disabled={variant.stockQuantity <= 0}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedVariant?.id === variant.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                          : 'border-slate-300 text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {[variant.color, variant.size].filter(Boolean).join(' / ') || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedVariant && (
              <div className="flex items-center gap-3">
                <Badge variant={outOfStock ? 'danger' : 'success'} size="md">
                  {outOfStock ? 'Hết hàng' : `Còn ${selectedVariant.stockQuantity} sản phẩm`}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  SKU: {selectedVariant.sku}
                </span>
              </div>
            )}

            {feedback && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stockQuantity ?? 1, q + 1))}
                  disabled={!selectedVariant || quantity >= selectedVariant.stockQuantity}
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                isLoading={addCartItem.isPending}
                disabled={!selectedVariant || outOfStock}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                className="flex-1"
              >
                Thêm Vào Giỏ Hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
