import { Edit2, HelpCircle, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Faq } from '../types/home.types';

export interface FaqTableProps {
  faqs: Faq[];
  isLoading: boolean;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export const FaqTable = ({ faqs, isLoading, onEdit, onDelete }: FaqTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Chưa có câu hỏi nào
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
              <th className="py-3.5 px-6">Câu hỏi</th>
              <th className="py-3.5 px-6">Thứ tự</th>
              <th className="py-3.5 px-6">Trạng thái</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {faqs.map((faq) => (
              <tr key={faq.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-4 px-6">
                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {faq.question}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {faq.answer}
                  </p>
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {faq.sortOrder}
                </td>
                <td className="py-4 px-6">
                  <Badge variant={faq.isActive ? 'success' : 'default'} size="sm">
                    {faq.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(faq)}
                      leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(faq)}
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
