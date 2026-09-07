import { ChevronDown } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ROUTES } from '@/routes/routes';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/category.types';

const getCategoryPath = (slug: string) => ROUTES.CATEGORY.replace(':slug', slug);

const containsActiveCategory = (category: Category, activeSlug?: string): boolean =>
  category.slug === activeSlug ||
  category.children.some((child) => containsActiveCategory(child, activeSlug));

const MobileCategoryLinks = ({
  categories,
  activeSlug,
  depth = 0,
  onNavigate,
}: {
  categories: Category[];
  activeSlug?: string;
  depth?: number;
  onNavigate?: () => void;
}) =>
  categories.map((category) => (
    <div key={category.id}>
      <Link
        to={getCategoryPath(category.slug)}
        onClick={onNavigate}
        style={{ paddingLeft: `${0.75 + depth * 1.25}rem` }}
        className={`block border-b border-slate-100 py-3 pr-3 text-sm transition-colors last:border-0 ${
          category.slug === activeSlug
            ? 'bg-brand-50 font-semibold text-brand-700'
            : depth === 0
              ? 'font-semibold text-slate-800 hover:bg-slate-50'
              : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'
        }`}
      >
        {category.name}
      </Link>
      {category.children.length > 0 && (
        <MobileCategoryLinks
          categories={category.children}
          activeSlug={activeSlug}
          depth={depth + 1}
          onNavigate={onNavigate}
        />
      )}
    </div>
  ));

export const CategoryPillNav = ({
  variant = 'desktop',
  onNavigate,
}: {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) => {
  const { tree } = useCategories();
  const { slug: activeSlug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const activeVariantValue = searchParams.get('variant');

  if (tree.length === 0) return null;

  if (variant === 'mobile') {
    return (
      <nav className="flex flex-col">
        <MobileCategoryLinks
          categories={tree}
          activeSlug={activeSlug}
          onNavigate={onNavigate}
        />
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2.5">
      {tree.map((category) => {
        const childNames = new Set(
          category.children.map((child) => child.name.toLocaleLowerCase('vi-VN')),
        );
        const variantValues = (category.variantValues ?? []).filter(
          (value) => !childNames.has(value.toLocaleLowerCase('vi-VN')),
        );
        const hasOptions = category.children.length > 0 || variantValues.length > 0;
        const isActive = containsActiveCategory(category, activeSlug);

        return (
          <div key={category.id} className="group relative shrink-0">
            <Link
              to={getCategoryPath(category.slug)}
              className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:text-brand-400'
              }`}
            >
              {category.name}
              {hasOptions && (
                <ChevronDown
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
                />
              )}
            </Link>

            {hasOptions && (
              <div className="invisible absolute left-1/2 top-full z-50 w-max max-w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <nav
                  aria-label={`Phân loại ${category.name}`}
                  className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      to={getCategoryPath(child.slug)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        child.slug === activeSlug
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:text-brand-400'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                  {variantValues.map((value) => (
                    <Link
                      key={value}
                      to={`${getCategoryPath(category.slug)}?variant=${encodeURIComponent(value)}`}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        category.slug === activeSlug && activeVariantValue === value
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:text-brand-400'
                      }`}
                    >
                      {value}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
