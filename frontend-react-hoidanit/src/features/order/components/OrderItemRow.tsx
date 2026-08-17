import { ImageOff } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { OrderItem } from '../types/order.types';

export const OrderItemRow = ({ item }: { item: OrderItem }) => (
  <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
      {item.thumbnailUrl ? (
        <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
      ) : (
        <ImageOff className="w-5 h-5 text-slate-400" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-slate-900 dark:text-white truncate">{item.productName}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.sku}</p>
    </div>
    <div className="text-sm text-slate-500 dark:text-slate-400">x{item.quantity}</div>
    <div className="w-28 text-right font-semibold text-slate-900 dark:text-white">
      {formatPrice(Number(item.price) * item.quantity)}
    </div>
  </div>
);
