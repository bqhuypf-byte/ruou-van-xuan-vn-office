import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  AlertCircle,
  ChevronRight,
  ImageOff,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { Badge, Button, Spinner } from '@/shared/components/ui';
import { PromoBand } from '@/shared/components/layout';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAddCartItem } from '@/features/cart';
import { ReviewList, StarRating, useProductReviews } from '@/features/review';
import { ROUTES } from '@/routes/routes';
import { ProductCard } from '../components/ProductCard';
import { useProductDetail } from '../hooks/useProductDetail';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useProductCacheStore } from '../stores/productCache.store';
import type { ProductVariant } from '../types/variant.types';
import type { ProductDetail } from '../services/product.service';
import type { FlatCategory } from '../hooks/useCategories';

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

const buildBreadcrumb = (
  categoryId: number,
  allCategories: FlatCategory[],
): FlatCategory[] => {
  const byId = new Map(allCategories.map((c) => [c.id, c]));
  const path: FlatCategory[] = [];
  let current = byId.get(categoryId);
  while (current) {
    path.unshift(current);
    current = current.parentId !== null ? byId.get(current.parentId) : undefined;
  }
  return path;
};

const ProductPurchasePanel = ({ product }: { product: ProductDetail }) => {
  const { allCategories } = useCategories();

  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))],
    [product.variants],
  );
  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))],
    [product.variants],
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(
    product.thumbnailUrl ?? product.images[0]?.imageUrl ?? null,
  );
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const addCartItem = useAddCartItem();
  const { reviews, averageRating, reviewCount, isLoading: reviewsLoading } = useProductReviews(
    product.id,
  );
  const { products: relatedProducts } = useProducts({
    categoryId: product.categoryId,
    isActive: true,
    limit: 5,
  });

  const selectedVariant: ProductVariant | null =
    product.variants.find(
      (v) =>
        (colors.length === 0 || v.color === selectedColor) &&
        (sizes.length === 0 || v.size === selectedSize),
    ) ??
    product.variants[0] ??
    null;

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
  const discountPercent =
    originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  const breadcrumb = buildBreadcrumb(product.categoryId, allCategories);
  const gallery = [
    product.thumbnailUrl,
    ...product.images.map((i) => i.imageUrl),
  ].filter((url): url is string => !!url);

  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Trang chủ
          </Link>
          {breadcrumb.map((category) => (
            <span key={category.id} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {category.name}
              </Link>
            </span>
          ))}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="flex gap-3">
            {gallery.length > 1 && (
              <div className="flex flex-col gap-3 shrink-0">
                {gallery.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === url
                        ? 'border-indigo-600'
                        : 'border-transparent bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-square rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="w-12 h-12 text-slate-400" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h1>

            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {averageRating.toFixed(1)}/5 ({reviewCount} đánh giá)
                </span>
              </div>
            )}

            {price !== null && (
              <div className="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatPrice(price)}
                </span>
                {originalPrice !== null && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discountPercent !== null && discountPercent > 0 && (
                  <Badge variant="danger" size="md">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {colors.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">Chọn Màu</p>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-indigo-600 scale-110'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Chọn Kích Thước</p>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {size}
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
              <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-full px-5 py-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-medium text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stockQuantity ?? 1, q + 1))}
                  disabled={!selectedVariant || quantity >= selectedVariant.stockQuantity}
                  aria-label="Tăng số lượng"
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                isLoading={addCartItem.isPending}
                disabled={!selectedVariant || outOfStock}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                className="rounded-full flex-1"
              >
                Thêm Vào Giỏ Hàng
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'details'
                  ? 'border-indigo-600 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              Đánh Giá &amp; Nhận Xét {reviewCount > 0 && `(${reviewCount})`}
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'details' ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </p>
            ) : (
              <ReviewList reviews={reviews} isLoading={reviewsLoading} />
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
          <div className="space-y-8 pt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-center text-slate-900 dark:text-white">
              Có Thể Bạn Cũng Thích
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
            </div>
          </div>
        )}
      </div>

      <PromoBand />
    </div>
  );
};
