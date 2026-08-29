import { Ticket } from 'lucide-react';

export interface VoucherFloatingButtonProps {
  onClick: () => void;
}

export const VoucherFloatingButton = ({ onClick }: VoucherFloatingButtonProps) => (
  <div className="fixed right-3 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] sm:right-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-50">
    <button
      onClick={onClick}
      aria-label="Tất Cả Ưu Đãi"
      className="flex items-center justify-center gap-1.5 min-h-10 px-3 sm:min-h-14 sm:gap-2 sm:pl-4 sm:pr-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg sm:shadow-xl transition-colors"
    >
      <Ticket className="w-6 h-6 shrink-0" />
      <span className="hidden sm:inline font-semibold whitespace-nowrap">Ưu Đãi</span>
    </button>
  </div>
);
