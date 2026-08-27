import { useState } from 'react';
import { Link } from 'react-router';
import { Package, Edit2, Trash2, ImageOff, X, XOctagon } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Product } from '../types/product.types';
import type { FlatCategory } from '../hooks/useCategories';
import { ROUTES } from '@/routes/routes';

export interface ProductTableProps {
  products: Product[];
  categories: FlatCategory[];
  isLoading: boolean;
  onDelete: (product: Product) => void;
  onHardDelete: (product: Product) => void;
  onChangeCategory: (product: Product, newCategoryId: number) => void;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  startIndex?: number;
}

export const ProductTable = ({
  products,
  categories,
  isLoading,
  onDelete,
  onHardDelete,
  onChangeCategory,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  startIndex = 0,
}: ProductTableProps) => {
  const [reassigningId, setReassigningId] = useState<number | null>(null);
  const categoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name ?? `#${categoryId}`;
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-4 w-1/3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Không tìm thấy sản phẩm nào
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới.
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
              <th className="py-3.5 px-6 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="py-3.5 px-6">STT</th>
              <th className="py-3.5 px-6">Sản Phẩm</th>
              <th className="py-3.5 px-6">Danh Mục</th>
              <th className="py-3.5 px-6">Trạng Thái</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                  selectedIds.has(product.id) ? 'bg-brand-50/60 dark:bg-brand-950/20' : ''
                }`}
              >
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
                    checked={selectedIds.has(product.id)}
                    onChange={() => onToggleSelect(product.id)}
                    aria-label={`Chọn sản phẩm ${product.name}`}
                  />
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {startIndex + index + 1}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                        <ImageOff className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {reassigningId === product.id ? (
                    <select
                      autoFocus
                      className="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
                      defaultValue=""
                      onBlur={() => setReassigningId(null)}
                      onChange={(e) => {
                        const newCategoryId = Number(e.target.value);
                        if (newCategoryId) onChangeCategory(product, newCategoryId);
                        setReassigningId(null);
                      }}
                    >
                      <option value="" disabled>
                        Chọn danh mục khác...
                      </option>
                      {categories
                        .filter((c) => c.id !== product.categoryId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {'—'.repeat(c.depth)} {c.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <Badge variant="primary" size="sm">
                      <span className="inline-flex items-center gap-1">
                        {categoryName(product.categoryId)}
                        <button
                          type="button"
                          onClick={() => setReassigningId(product.id)}
                          title="Gỡ khỏi danh mục này (chọn danh mục khác)"
                          className="hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-6">
                  {product.isActive ? (
                    <Badge variant="success" size="md">
                      Đang Bán
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="md">
                      Ngừng Bán
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link to={ROUTES.ADMIN_PRODUCT_DETAIL.replace(':slug', product.slug)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Sửa thông tin, phân loại, giá, tồn kho và hình ảnh"
                        leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                      >
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product)}
                      title="Ngừng bán"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Xóa
                    </Button>
                    {!product.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onHardDelete(product)}
                        title="Xóa vĩnh viễn"
                        className="text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/70"
                        leftIcon={<XOctagon className="w-4 h-4" />}
                      >
                        Xóa Vĩnh Viễn
                      </Button>
                    )}
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
