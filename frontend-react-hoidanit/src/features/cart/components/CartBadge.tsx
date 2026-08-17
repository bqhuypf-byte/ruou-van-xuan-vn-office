import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useCart } from '../hooks/useCart';

export const CartBadge = () => {
  const { itemCount } = useCart();

  return (
    <Link
      to={ROUTES.CART}
      className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
      aria-label="Giỏ hàng"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};
