import { useState } from 'react';
import { Check, Copy, Ticket } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { Voucher } from '../types/home.types';

export interface VoucherCardProps {
  voucher: Voucher;
}

export const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const [copied, setCopied] = useState(false);

  const discountLabel =
    voucher.discountType === 'percent'
      ? `Giảm ${Number(voucher.discountValue)}%${
          voucher.maxDiscountAmount
            ? ` (tối đa ${formatPrice(Number(voucher.maxDiscountAmount))})`
            : ''
        }`
      : `Giảm ${formatPrice(Number(voucher.discountValue))}`;

  const minOrderLabel =
    Number(voucher.minOrderAmount) > 0
      ? `Cho đơn từ ${formatPrice(Number(voucher.minOrderAmount))}`
      : 'Không giới hạn giá trị đơn hàng';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available, ignore
    }
  };

  return (
    <div className="flex rounded-xl border border-dashed border-brand-300 dark:border-brand-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="w-16 shrink-0 bg-brand-600 flex items-center justify-center text-white">
        <Ticket className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white">{discountLabel}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{voucher.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{minOrderLabel}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-brand-300 dark:border-brand-700 px-3 py-1.5 text-xs font-mono font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {voucher.code}
        </button>
      </div>
    </div>
  );
};
