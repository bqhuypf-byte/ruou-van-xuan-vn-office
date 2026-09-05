import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { Badge, Button, RichTextContent, Spinner } from '@/shared/components/ui';
import { BottleIcon } from '@/shared/components/icons';
import { PromoBand } from '@/shared/components/layout';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { getPlaceholderTint } from '@/shared/utils/placeholderTint';
import { useAddCartItem } from '@/features/cart';
import { ReviewList, StarRating, useProductReviews } from '@/features/review';
import { ROUTES } from '@/routes/routes';
import { ProductCard } from '../components/ProductCard';
import { ProductSeo } from '../components/ProductSeo';
import { useProductDetail } from '../hooks/useProductDetail';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useProductCacheStore } from '../stores/productCache.store';
import type { ProductVariant } from '../types/variant.types';
import type { ProductDetail } from '../services/product.service';
import type { FlatCategory } from '../hooks/useCategories';
import {
  findVariantForAttributes,
  getAttributeOptionImage,
  getConfiguredAttributeOptions,
} from '../utils/variantImage.utils';

export const ProductViewPage = () => {
  const { t } = useTranslation();
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
              {t('product.loadError', {
                reason: error instanceof Error ? error.message : t('common.notFound'),
              })}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductSeo product={product} />
      <ProductPurchasePanel key={product.id} product={product} />
    </>
  );
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { allCategories } = useCategories();

  const attributeNames = useMemo(() => (product.variantAttributes ?? []).map((g) => g.name), [product.variantAttributes]);
  const attributeOptions = useMemo(
    () => getConfiguredAttributeOptions(product.variantAttributes ?? []),
    [product.variantAttributes],
  );

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(attributeNames.map((name) => [name, attributeOptions[name]?.[0] ?? null])),
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(
    product.thumbnailUrl ??
      product.images.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]?.imageUrl ??
      null,
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

  const findVariant = (attributes: Record<string, string | null>) =>
    findVariantForAttributes(product.variants, attributeNames, attributeOptions, attributes);

  const selectedVariant: ProductVariant | null =
    findVariant(selectedAttributes) ??
    product.variants[0] ??
    null;

  const getOptionImage = (name: string, value: string): string | null => {
    return getAttributeOptionImage(product, name, value);
  };

  const handleSelectAttribute = (name: string, value: string) => {
    const nextAttributes = { ...selectedAttributes, [name]: value };
    setSelectedAttributes(nextAttributes);
    setQuantity(1);

    const nextVariant = findVariant(nextAttributes);
    const nextImage = getOptionImage(name, value) ?? nextVariant?.imageUrl;
    if (nextImage) setActiveImage(nextImage);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setFeedback(null);
    try {
      await addCartItem.mutateAsync({ productVariantId: selectedVariant.id, quantity });
      setFeedback({ type: 'success', message: t('product.addedToCart') });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, t('product.addToCartError')) });
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setFeedback(null);
    try {
      await addCartItem.mutateAsync({ productVariantId: selectedVariant.id, quantity });
      navigate(ROUTES.CART);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, t('product.addToCartError')) });
    }
  };

  const price = selectedVariant ? Number(selectedVariant.salePrice ?? selectedVariant.price) : null;
  const originalPrice = selectedVariant?.salePrice ? Number(selectedVariant.price) : null;
  const discountPercent =
    originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  const breadcrumb = buildBreadcrumb(product.categoryId, allCategories);
  const gallery = [
    ...new Set(
      [
        product.thumbnailUrl,
        ...product.images
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((image) => image.imageUrl),
        ...(product.variantAttributes ?? []).flatMap((group) => Object.values(group.images ?? {})),
        ...product.variants.map((variant) => variant.imageUrl),
      ].filter((url): url is string => !!url),
    ),
  ];

  return (
    <div className="bg-white dark:bg-slate-950 pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-brand-600 dark:hover:text-brand-400">
            {t('product.home')}
          </Link>
          {breadcrumb.map((category) => (
            <span key={category.id} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                className="hover:text-brand-600 dark:hover:text-brand-400"
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
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              {activeImage ? (
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-300"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white/85"
                  style={{ backgroundColor: getPlaceholderTint(product.id) }}
                >
                  <BottleIcon className="w-16 h-16" />
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {gallery.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-slate-100 dark:bg-slate-800 transition-colors duration-200 ${
                      activeImage === url ? 'border-brand-600' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
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
                  {t('product.reviewsCount', { rating: averageRating.toFixed(1), count: reviewCount })}
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

            {attributeNames
              .filter((name) => (attributeOptions[name]?.length ?? 0) > 0)
              .map((name) => (
                <div key={name} className="space-y-2.5 pt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{name}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {attributeOptions[name].map((value) => {
                      const optionImage = getOptionImage(name, value);
                      const isSelected = selectedAttributes[name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleSelectAttribute(name, value)}
                          className={`relative inline-flex min-h-10 items-center gap-2 border bg-white text-sm font-medium text-slate-800 transition-all duration-200 dark:bg-slate-900 dark:text-slate-200 ${
                            optionImage ? 'py-1 pl-1 pr-3' : 'px-4 py-2'
                          } ${
                            isSelected
                              ? 'rounded-xl border-slate-900 shadow-sm dark:border-white'
                              : 'rounded-md border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'
                          }`}
                        >
                          {optionImage && (
                            <img
                              src={optionImage}
                              alt=""
                              className="h-8 w-8 rounded border border-slate-100 bg-white object-contain dark:border-slate-700"
                            />
                          )}
                          {value}
                          {isSelected && (
                            <span className="absolute bottom-0 right-0 h-4 w-4 overflow-hidden rounded-br-[10px] bg-slate-900 [clip-path:polygon(100%_0,100%_100%,0_100%)] dark:bg-white">
                              <Check className="absolute bottom-0 right-0 h-2.5 w-2.5 text-white dark:text-slate-900" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {selectedVariant && (
              <div className="flex items-center gap-3">
                <Badge variant={outOfStock ? 'danger' : 'success'} size="md">
                  {outOfStock
                    ? t('product.outOfStock')
                    : t('product.inStock', { count: selectedVariant.stockQuantity })}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {t('product.sku')}: {selectedVariant.sku}
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
                  aria-label={t('product.decreaseQty')}
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
                  aria-label={t('product.increaseQty')}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {selectedVariant && selectedVariant.stockQuantity > 0 && selectedVariant.stockQuantity <= 20 && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {t('product.onlyLeft', { count: selectedVariant.stockQuantity })}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Button
                size="lg"
                onClick={handleBuyNow}
                isLoading={addCartItem.isPending}
                disabled={!selectedVariant || outOfStock}
                className="rounded-full flex-1"
              >
                {t('product.buyNow')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                isLoading={addCartItem.isPending}
                disabled={!selectedVariant || outOfStock}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                className="rounded-full flex-1 whitespace-nowrap"
              >
                {t('product.addToCart')}
              </Button>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3 pt-4">
                <Truck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('product.freeDelivery')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('product.freeDeliverySubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('product.returnDelivery')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('product.returnDeliverySubtitle')}
                  </p>
                </div>
              </div>
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
                  ? 'border-brand-600 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              {t('product.tabDetails')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'reviews'
                  ? 'border-brand-600 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              {t('product.tabReviews')} {reviewCount > 0 && `(${reviewCount})`}
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'details' ? (
              product.description ? (
                <RichTextContent html={product.description} className="max-w-2xl" />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {t('product.noDescription')}
                </p>
              )
            ) : (
              <ReviewList reviews={reviews} isLoading={reviewsLoading} />
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
          <div className="space-y-8 pt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-center text-slate-900 dark:text-white">
              {t('product.relatedProducts')}
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

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
              {product.name}
            </span>
            <span className="text-base font-extrabold text-brand-700 dark:text-brand-400 font-heading leading-tight">
              {price ? formatPrice(price) : 'Liên hệ'}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            isLoading={addCartItem.isPending}
            disabled={!selectedVariant || outOfStock}
            className="rounded-full px-3 text-xs"
            aria-label={t('product.addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleBuyNow}
            isLoading={addCartItem.isPending}
            disabled={!selectedVariant || outOfStock}
            className="rounded-full px-5 text-xs font-bold"
          >
            {t('product.buyNow')}
          </Button>
        </div>
      </div>
    </div>
  );
};
