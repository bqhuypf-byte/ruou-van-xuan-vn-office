import { Edit2, ImageIcon, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Brand } from '../types/home.types';

export interface BrandTableProps {
  brands: Brand[];
  isLoading: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export const BrandTable = ({ brands, isLoading, onEdit, onDelete }: BrandTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Chưa có thương hiệu nào
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3.5 px-6">Thương hiệu</th>
              <th className="py-3.5 px-6">Thứ tự</th>
              <th className="py-3.5 px-6">Trạng thái</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {brand.imageUrl ? (
                      <img
                        src={brand.imageUrl}
                        alt=""
                        className="w-14 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{brand.name}</p>
                      {brand.badgeText && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {brand.badgeText}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {brand.sortOrder}
                </td>
                <td className="py-4 px-6">
                  <Badge variant={brand.isActive ? 'success' : 'default'} size="sm">
                    {brand.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(brand)}
                      leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(brand)}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
