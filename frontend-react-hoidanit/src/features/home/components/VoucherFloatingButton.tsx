import { Ticket } from 'lucide-react';

export interface VoucherFloatingButtonProps {
  onClick: () => void;
}

export const VoucherFloatingButton = ({ onClick }: VoucherFloatingButtonProps) => (
  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
    <button
      onClick={onClick}
      aria-label="Tất Cả Ưu Đãi"
      className="flex items-center justify-center gap-2 w-14 h-14 sm:w-auto sm:justify-start sm:pl-4 sm:pr-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition-colors"
    >
      <Ticket className="w-6 h-6 shrink-0" />
      <span className="hidden sm:inline font-semibold whitespace-nowrap">Ưu Đãi</span>
    </button>
  </div>
);
