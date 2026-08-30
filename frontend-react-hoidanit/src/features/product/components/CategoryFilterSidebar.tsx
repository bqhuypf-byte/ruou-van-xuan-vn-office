import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { SlidersHorizontal, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/category.types';

interface PricePreset {
  label: string;
  min?: number;
  max?: number;
}

const PRICE_PRESETS: PricePreset[] = [
  { label: 'Tất cả mức giá', min: undefined, max: undefined },
  { label: 'Dưới 500.000₫', min: undefined, max: 500000 },
  { label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
  { label: '1.000.000₫ - 2.000.000₫', min: 1000000, max: 2000000 },
  { label: 'Trên 2.000.000₫', min: 2000000, max: undefined },
];

export interface CategoryFilterSidebarProps {
  currentCategory?: Category | null;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
  className?: string;
  onCloseMobile?: () => void;
}

export const CategoryFilterSidebar = ({
  currentCategory: _currentCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
  className = '',
  onCloseMobile,
}: CategoryFilterSidebarProps) => {
  const { tree } = useCategories();
  const { slug: activeSlug } = useParams<{ slug: string }>();

  const [customMin, setCustomMin] = useState<string>(minPrice ? String(minPrice) : '');
  const [customMax, setCustomMax] = useState<string>(maxPrice ? String(maxPrice) : '');

  useEffect(() => {
    setCustomMin(minPrice ? String(minPrice) : '');
    setCustomMax(maxPrice ? String(maxPrice) : '');
  }, [minPrice, maxPrice]);

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = customMin.trim() ? Number(customMin.replace(/\D/g, '')) : undefined;
    const maxVal = customMax.trim() ? Number(customMax.replace(/\D/g, '')) : undefined;
    onPriceChange(minVal, maxVal);
    onCloseMobile?.();
  };

  const handleSelectPreset = (preset: PricePreset) => {
    setCustomMin(preset.min ? String(preset.min) : '');
    setCustomMax(preset.max ? String(preset.max) : '');
    onPriceChange(preset.min, preset.max);
    onCloseMobile?.();
  };

  const isPresetActive = (preset: PricePreset) => {
    return preset.min === minPrice && preset.max === maxPrice;
  };

  const hasActiveFilters = minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-700 dark:text-brand-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bộ lọc</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Categories Tree */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Danh mục sản phẩm
        </h3>
        <div className="space-y-1">
          {tree.map((cat) => {
            const isCatActive = cat.slug === activeSlug;
            const hasChildren = cat.children.length > 0;
            const isChildActive = cat.children.some((c) => c.slug === activeSlug);

            return (
              <div key={cat.id} className="space-y-1">
                <Link
                  to={ROUTES.CATEGORY.replace(':slug', cat.slug)}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isCatActive
                      ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isCatActive && <Check className="w-4 h-4 text-brand-700 dark:text-brand-400" />}
                </Link>

                {hasChildren && (isCatActive || isChildActive) && (
                  <div className="ml-3 pl-3 border-l border-brand-200 dark:border-brand-900 space-y-0.5">
                    {cat.children.map((child) => {
                      const isChildCurrent = child.slug === activeSlug;
                      return (
                        <Link
                          key={child.id}
                          to={ROUTES.CATEGORY.replace(':slug', child.slug)}
                          onClick={onCloseMobile}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            isChildCurrent
                              ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/50 dark:text-brand-400'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <span>{child.name}</span>
                          {isChildCurrent && <ChevronRight className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Mức giá
        </h3>

        {/* Preset Options */}
        <div className="space-y-1.5">
          {PRICE_PRESETS.map((preset, idx) => {
            const active = isPresetActive(preset);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200 dark:bg-brand-950/40 dark:text-brand-400 dark:border-brand-900'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{preset.label}</span>
                {active && <Check className="w-4 h-4 text-brand-700 dark:text-brand-400" />}
              </button>
            );
          })}
        </div>

        {/* Custom Price Range Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="pt-2 space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hoặc nhập khoảng giá (VNĐ):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="sr-only" htmlFor="min-price-input">Giá từ</label>
              <input
                id="min-price-input"
                type="number"
                min="0"
                step="10000"
                placeholder="Từ ₫"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="max-price-input">Giá đến</label>
              <input
                id="max-price-input"
                type="number"
                min="0"
                step="10000"
                placeholder="Đến ₫"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full rounded-xl text-xs font-semibold hover:bg-brand-600 hover:text-white hover:border-brand-600"
          >
            Áp dụng giá
          </Button>
        </form>
      </div>
    </div>
  );
};
