import { Link, useNavigate } from 'react-router';
import { ImageOff } from 'lucide-react';
import { Badge } from '@/shared/components/ui';
import type { Product } from '../types/product.types';
import { ROUTES } from '@/routes/routes';

export interface ProductCardProps {
  product: Product;
  categoryName?: string;
  categorySlug?: string;
}

export const ProductCard = ({ product, categoryName, categorySlug }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (e: React.MouseEvent) => {
    if (!categorySlug) return;
    e.preventDefault();
    e.stopPropagation();
    navigate(ROUTES.CATEGORY.replace(':slug', categorySlug));
  };

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ImageOff className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        {categoryName && (
          <span onClick={handleCategoryClick} className="inline-block">
            <Badge variant="primary" size="sm">
              {categoryName}
            </Badge>
          </span>
        )}
        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.name}
        </h3>
      </div>
    </Link>
  );
};
