import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronDown, ClipboardList, LogOut, MapPin, SlidersHorizontal } from 'lucide-react';
import { useAuthStore, useLogout } from '@/features/auth';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ROUTES } from '@/routes/routes';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const initial = user.fullName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutMutation.mutateAsync();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 pl-2 ml-1 py-1.5 pr-2 rounded-full border-l border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {initial}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
          {user.fullName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-800">
            <p className="font-semibold text-white">{user.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <nav className="p-2">
            <Link
              to={ROUTES.PROFILE}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4 shrink-0" />
              Địa Chỉ Của Tôi
            </Link>
            <Link
              to={ROUTES.ORDERS}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              Đơn Hàng Của Tôi
            </Link>
            {isAdmin && (
              <Link
                to={ROUTES.ADMIN_ROLES}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                Trang Quản Trị
              </Link>
            )}
          </nav>

          <div className="border-t border-slate-800 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Đăng Xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
