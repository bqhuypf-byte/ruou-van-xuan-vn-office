import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import { BottleIcon } from '@/shared/components/icons';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getPlaceholderTint } from '@/shared/utils/placeholderTint';
import { ROUTES } from '@/routes/routes';
import type { EnrichedCartItem } from '../types/cart.types';

export interface CartItemRowProps {
  item: EnrichedCartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export const CartItemRow = ({
  item,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: CartItemRowProps) => {
  const { t } = useTranslation();
  const unitPrice = Number(item.salePrice ?? item.price);
  const lineTotal = unitPrice * item.quantity;

  const image = item.thumbnailUrl ? (
    <img src={item.thumbnailUrl} alt={item.productName ?? item.sku} className="w-full h-full object-cover" />
  ) : (
    <div
      className="w-full h-full flex items-center justify-center text-white/85"
      style={{ backgroundColor: getPlaceholderTint(item.productVariantId) }}
    >
      <BottleIcon className="w-6 h-6" />
    </div>
  );

  const nameContent = item.productSlug ? (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.productSlug)}
      className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-2 transition-colors"
    >
      {item.productName}
    </Link>
  ) : (
    <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{item.sku}</span>
  );

  return (
    <div className="py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      {/* Mobile Layout (< sm) */}
      <div className="flex sm:hidden gap-3.5 items-start">
        <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-800">
          {image}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            {nameContent}
            <button
              type="button"
              onClick={onRemove}
              disabled={isRemoving}
              aria-label={t('cart.removeItem')}
              className="p-1 -mr-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(item.attributes)
                .filter(([, value]) => value)
                .map(([name, value]) => (
                  <Badge key={name} size="sm" title={name} className="text-[10px] py-0.5 px-2">
                    {value}
                  </Badge>
                ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-bold text-brand-700 dark:text-brand-400">
              {formatPrice(unitPrice)}
            </div>

            {/* Stepper with touch-friendly size */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/80 overflow-hidden">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
                disabled={isUpdating || item.quantity <= 1}
                aria-label={t('cart.decreaseQty')}
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-semibold text-slate-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= item.stockQuantity}
                aria-label={t('cart.increaseQty')}
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Layout (>= sm) */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-800">
          {image}
        </div>

        <div className="flex-1 min-w-0">
          {nameContent}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.attributes &&
              Object.entries(item.attributes)
                .filter(([, value]) => value)
                .map(([name, value]) => (
                  <Badge key={name} size="sm" title={name}>
                    {value}
                  </Badge>
                ))}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">{item.sku}</p>
        </div>

        <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
            disabled={isUpdating || item.quantity <= 1}
            aria-label={t('cart.decreaseQty')}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= item.stockQuantity}
            aria-label={t('cart.increaseQty')}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-28 text-right font-bold text-slate-900 dark:text-white">
          {formatPrice(lineTotal)}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          isLoading={isRemoving}
          title={t('cart.removeItem')}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-xl"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
