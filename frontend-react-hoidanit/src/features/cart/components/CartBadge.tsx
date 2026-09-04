import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { formatPrice } from '@/shared/utils/formatPrice';
import { useCart } from '../hooks/useCart';

export const CartBadge = () => {
  const { t } = useTranslation();
  const { itemCount, subtotal } = useCart();
  const [isBumping, setIsBumping] = useState(false);
  const previousSubtotal = useRef(subtotal);

  useEffect(() => {
    if (subtotal > previousSubtotal.current) {
      const frame = requestAnimationFrame(() => setIsBumping(true));
      const timeout = setTimeout(() => setIsBumping(false), 400);
      previousSubtotal.current = subtotal;
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timeout);
      };
    }
    previousSubtotal.current = subtotal;
  }, [subtotal]);

  return (
    <Link
      to={ROUTES.CART}
      className="relative flex items-center gap-2 p-2 rounded-lg text-gold-700 hover:bg-gold-50 dark:text-gold-300 dark:hover:bg-slate-800 transition-colors"
      aria-label={t('header.cart')}
    >
      <span className="relative">
        <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isBumping ? 'scale-125' : 'scale-100'}`} />
        {itemCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-500 text-brand-950 text-[10px] font-bold flex items-center justify-center transition-transform duration-300 ${
              isBumping ? 'scale-125' : 'scale-100'
            }`}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </span>
      {subtotal > 0 ? (
        <span
          className={`hidden sm:inline text-sm font-semibold text-slate-900 dark:text-white transition-transform duration-300 ${
            isBumping ? 'scale-110' : 'scale-100'
          }`}
        >
          {formatPrice(subtotal)}
        </span>
      ) : (
        <span className="hidden sm:inline text-sm font-semibold text-slate-900 dark:text-white">
          {t('header.cart')}
        </span>
      )}
    </Link>
  );
};
