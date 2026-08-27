import { Layers, Edit2, Trash2, FolderTree, FolderPlus } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { FlatCategory } from '../hooks/useCategories';

export interface CategoryTableProps {
  categories: FlatCategory[];
  isLoading: boolean;
  onEdit: (category: FlatCategory) => void;
  onDelete: (category: FlatCategory) => void;
  onAddChild: (category: FlatCategory) => void;
}

export const CategoryTable = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTableProps) => {
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
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
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

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderTree className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Không tìm thấy danh mục nào
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc thêm danh mục mới.
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
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-6">Tên Danh Mục</th>
              <th className="py-3.5 px-6">Slug</th>
              <th className="py-3.5 px-6">Danh Mục Cha</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                  #{category.id}
                </td>
                <td className="py-4 px-6">
                  <div
                    className="flex items-center gap-3"
                    style={{ paddingLeft: `${category.depth * 20}px` }}
                  >
                    {category.thumbnailUrl ? (
                      <img
                        src={category.thumbnailUrl}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                    )}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-xs">
                  {category.slug}
                </td>
                <td className="py-4 px-6">
                  {category.parentName ? (
                    <Badge variant="primary" size="sm">
                      {category.parentName}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      Gốc (Root)
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!category.parentId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddChild(category)}
                        title="Thêm phân loại nhỏ"
                        className="text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-950/50"
                        leftIcon={<FolderPlus className="w-4 h-4" />}
                      >
                        Thêm Con
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa"
                      leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(category)}
                      title="Xóa"
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
