import { Edit2, ExternalLink, FileText, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Page } from '../types/home.types';

export interface PageTableProps {
  pages: Page[];
  isLoading: boolean;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
}

export const PageTable = ({ pages, isLoading, onEdit, onDelete }: PageTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Chưa có trang nào
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
              <th className="py-3.5 px-6">Tiêu đề</th>
              <th className="py-3.5 px-6">Đường dẫn</th>
              <th className="py-3.5 px-6">Trạng thái</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-4 px-6">
                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {page.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {page.content}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <a
                    href={`/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    /{page.slug}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={page.isActive ? 'success' : 'default'} size="sm">
                    {page.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(page)}
                      leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(page)}
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
