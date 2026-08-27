import { ProductCard } from './ProductCard';
import type { Product } from '../types/product.types';

export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  skeletonCount?: number;
}

export const ProductGrid = ({ products, isLoading, skeletonCount = 8 }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
