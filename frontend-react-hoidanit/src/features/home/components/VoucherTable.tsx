import { Edit2, Ticket, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { Voucher } from '../types/home.types';

export interface VoucherTableProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
}

const getVoucherStatus = (voucher: Voucher) => {
  const today = new Date().toISOString().slice(0, 10);

  if (!voucher.isActive) return { label: 'Đã tắt', variant: 'default' as const };
  if (voucher.startDate && voucher.startDate > today) {
    return { label: 'Sắp diễn ra', variant: 'info' as const };
  }
  if (voucher.endDate && voucher.endDate < today) {
    return { label: 'Hết hạn', variant: 'danger' as const };
  }
  return { label: 'Đang tự áp dụng', variant: 'success' as const };
};

const formatDate = (value: string | null) => {
  if (!value) return null;
  return new Intl.DateTimeFormat('vi-VN').format(new Date(`${value}T00:00:00`));
};

export const VoucherTable = ({ vouchers, isLoading, onEdit, onDelete }: VoucherTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Chưa có voucher nào
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
              <th className="py-3.5 px-6">Mã</th>
              <th className="py-3.5 px-6">Tiêu đề</th>
              <th className="py-3.5 px-6">Giảm giá</th>
              <th className="py-3.5 px-6">Đơn tối thiểu</th>
              <th className="py-3.5 px-6">Hiệu lực</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vouchers.map((voucher) => {
              const status = getVoucherStatus(voucher);
              const startDate = formatDate(voucher.startDate);
              const endDate = formatDate(voucher.endDate);

              return (
                <tr key={voucher.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-4 px-6 font-mono font-semibold text-brand-700 dark:text-brand-400">
                    <span>{voucher.code}</span>
                    <span className="mt-1 block font-sans text-[11px] font-medium text-slate-400">
                      Ưu tiên {voucher.sortOrder}
                    </span>
                    {voucher.newMemberOnly && (
                      <span className="mt-1 block font-sans text-[11px] font-semibold text-brand-600">
                        Thành viên mới
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {voucher.title}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {voucher.discountType === 'percent'
                        ? `${Number(voucher.discountValue)}%`
                        : formatPrice(Number(voucher.discountValue))}
                    </p>
                    {voucher.discountType === 'percent' && voucher.maxDiscountAmount && (
                      <p className="mt-1 text-xs text-slate-400">
                        Tối đa {formatPrice(Number(voucher.maxDiscountAmount))}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                    {Number(voucher.minOrderAmount) > 0
                      ? formatPrice(Number(voucher.minOrderAmount))
                      : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                    <p className="mt-1.5 whitespace-nowrap text-xs text-slate-400">
                      {startDate || endDate
                        ? `${startDate ?? 'Không giới hạn'} – ${endDate ?? 'Không giới hạn'}`
                        : 'Không giới hạn thời gian'}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(voucher)}
                        leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(voucher)}
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
