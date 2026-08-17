import { Boxes, Edit2, PackageX } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { ProductVariant } from '../types/variant.types';

export interface VariantTableProps {
  variants: ProductVariant[];
  isLoading: boolean;
  onEdit: (variant: ProductVariant) => void;
}

export const VariantTable = ({ variants, isLoading, onEdit }: VariantTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <PackageX className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Chưa có biến thể nào
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Thêm biến thể (màu sắc, kích cỡ, giá) cho sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-5">SKU</th>
              <th className="py-3 px-5">Màu / Kích Cỡ</th>
              <th className="py-3 px-5">Giá</th>
              <th className="py-3 px-5">Tồn Kho</th>
              <th className="py-3 px-5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-5 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {variant.sku}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex gap-1.5">
                    {variant.color && <Badge size="sm">{variant.color}</Badge>}
                    {variant.size && <Badge size="sm">{variant.size}</Badge>}
                    {!variant.color && !variant.size && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  {variant.salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {formatPrice(Number(variant.salePrice))}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(Number(variant.price))}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatPrice(Number(variant.price))}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5">
                  <Badge variant={variant.stockQuantity > 0 ? 'success' : 'danger'} size="sm">
                    <Boxes className="w-3 h-3" />
                    {variant.stockQuantity}
                  </Badge>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(variant)}
                    title="Chỉnh sửa"
                    leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                  >
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
