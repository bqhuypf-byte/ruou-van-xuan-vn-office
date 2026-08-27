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
      className="font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
    >
      {item.productName}
    </Link>
  ) : (
    <span className="font-semibold text-slate-900 dark:text-white">{item.sku}</span>
  );

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
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
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{item.sku}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
          disabled={isUpdating || item.quantity <= 1}
          aria-label={t('cart.decreaseQty')}
        >
          <Minus className="w-3.5 h-3.5" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.stockQuantity}
          aria-label={t('cart.increaseQty')}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="w-28 text-right font-semibold text-slate-900 dark:text-white">
        {formatPrice(lineTotal)}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        isLoading={isRemoving}
        title={t('cart.removeItem')}
        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
