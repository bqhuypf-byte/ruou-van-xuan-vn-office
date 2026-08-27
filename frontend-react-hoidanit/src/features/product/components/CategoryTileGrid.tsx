import { Link } from 'react-router';
import { Layers } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import type { Category } from '../types/category.types';

export interface CategoryTileGridProps {
  categories: Category[];
  title: string;
}

const TILE_COLORS = [
  'var(--color-accent-beige)',
  'var(--color-accent-pink)',
  'var(--color-accent-mint)',
  'var(--color-brand-100)',
  'var(--color-accent-peach)',
  'var(--color-brand-200)',
];

export const CategoryTileGrid = ({ categories, title }: CategoryTileGridProps) => {
  if (categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
        {title}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category, i) => (
          <Link key={category.id} to={ROUTES.CATEGORY.replace(':slug', category.slug)} className="group flex flex-col gap-2">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all"
              style={{ backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }}
            >
              {category.thumbnailUrl ? (
                <img
                  src={category.thumbnailUrl}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Layers className="absolute right-3 bottom-3 w-8 h-8 text-brand-900/30" />
              )}
            </div>
            <span className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200 text-center line-clamp-1">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
