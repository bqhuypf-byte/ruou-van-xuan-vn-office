import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  PackageSearch,
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useBanners, useBrands } from '@/features/home';
import { ROUTES } from '@/routes/routes';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories, getTopCategories, getDailyEssentialCategories } from '../hooks/useCategories';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [activeBanner, setActiveBanner] = useState(0);

  const { products, isLoading, isError, error, refetch, meta } = useProducts({
    page,
    limit: 12,
    categoryId,
    search,
    isActive: true,
  });
  const { products: dealProducts } = useProducts({ isFeaturedDeal: true, limit: 5, isActive: true });
  const { tree: categoryTree, allCategories } = useCategories();
  const { data: banners } = useBanners();
  const { data: brands } = useBrands();

  const topCategories = getTopCategories(categoryTree);
  const dailyEssentials = getDailyEssentialCategories(categoryTree);

  const categoryName = (id: number) => allCategories.find((c) => c.id === id)?.name;
  const categorySlug = (id: number) => allCategories.find((c) => c.id === id)?.slug;

  const heroBanners = banners ?? [];
  const banner = heroBanners[activeBanner];

  const handleBannerCta = () => {
    if (!banner?.ctaLink) return;
    if (/^https?:\/\//.test(banner.ctaLink)) {
      window.open(banner.ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(banner.ctaLink);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero banner carousel */}
      {banner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <section
            className="relative overflow-hidden rounded-2xl min-h-[300px] flex items-center px-8 sm:px-12"
            style={{ backgroundColor: banner.bgColor ?? '#212844' }}
          >
            <div className="relative z-10 max-w-lg py-10">
              {banner.subtitle && (
                <p className="text-white/90 font-semibold text-lg">{banner.subtitle}</p>
              )}
              <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold uppercase text-white leading-tight">
                {banner.title}
              </h1>
              {banner.badgeText && (
                <p className="mt-3 text-xl font-semibold text-white/90">{banner.badgeText}</p>
              )}
              {banner.ctaLink && (
                <Button
                  size="lg"
                  className="mt-6 rounded-full px-8 !bg-white !text-[#212844] hover:!bg-slate-100"
                  onClick={handleBannerCta}
                >
                  Shop Now
                </Button>
              )}
            </div>
            {banner.imageUrl && (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 max-h-[80%] object-contain"
              />
            )}
            {heroBanners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveBanner((i) => (i - 1 + heroBanners.length) % heroBanners.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                  aria-label="Banner trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveBanner((i) => (i + 1) % heroBanners.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                  aria-label="Banner tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {heroBanners.map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => setActiveBanner(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Xem banner ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Grab the best deal */}
      {dealProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200">
              Grab the best deal on{' '}
              <span className="text-[#008ECC]">Products</span>
            </h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#008ECC] hover:underline shrink-0"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {dealProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.categoryId)}
                categorySlug={categorySlug(product.categoryId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shop From Top Categories */}
      {topCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
            Shop From <span className="text-[#008ECC]">Top Categories</span>
          </h2>
          <div className="flex items-start gap-6 overflow-x-auto pb-2 -mx-1 px-1">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-24 text-center"
              >
                <span className="w-[100px] h-[100px] rounded-full bg-[#F5F5F5] dark:bg-slate-800 border-2 border-transparent group-hover:border-[#008ECC] transition-colors overflow-hidden flex items-center justify-center text-[#008ECC]">
                  {category.thumbnailUrl ? (
                    <img
                      src={category.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Layers className="w-8 h-8" />
                  )}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top Electronics Brands */}
      {brands && brands.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
            Top <span className="text-[#008ECC]">Brands</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.slice(0, 3).map((brand) => (
              <Link
                key={brand.id}
                to={brand.ctaLink ?? ROUTES.PRODUCTS}
                className="relative h-[207px] rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
                style={{ backgroundColor: brand.bgColor ?? '#313131' }}
              >
                {brand.badgeText && (
                  <span
                    className="self-start px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide"
                    style={{ backgroundColor: brand.tagPillColor ?? '#494949', color: '#fff' }}
                  >
                    {brand.name}
                  </span>
                )}
                <p className="text-xl font-semibold text-white">{brand.badgeText}</p>
                {brand.imageUrl && (
                  <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="absolute right-4 bottom-0 h-[85%] object-contain"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Daily Essentials */}
      {dailyEssentials.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
            Daily <span className="text-[#008ECC]">Essentials</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {dailyEssentials.map((category) => (
              <Link
                key={category.id}
                to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                className="group aspect-square rounded-2xl bg-[#F5F5F5] dark:bg-slate-800 overflow-hidden flex flex-col items-center justify-center gap-2 text-center p-4"
              >
                {category.thumbnailUrl ? (
                  <img
                    src={category.thumbnailUrl}
                    alt=""
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <Layers className="w-10 h-10 text-[#008ECC]" />
                )}
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200">
            Tất Cả <span className="text-[#008ECC]">Sản Phẩm</span>
          </h2>
          <Link
            to={ROUTES.PRODUCTS}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#008ECC] hover:underline shrink-0"
          >
            Xem Tất Cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Button
            variant={categoryId === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setCategoryId(undefined);
              setPage(1);
            }}
          >
            Tất cả
          </Button>
          {categoryTree.map((category) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setCategoryId(category.id);
                setPage(1);
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                Không thể tải sản phẩm ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử Lại
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Chưa có sản phẩm nào
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.categoryId)}
                categorySlug={categorySlug(product.categoryId)}
              />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trang {meta.page} / {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
