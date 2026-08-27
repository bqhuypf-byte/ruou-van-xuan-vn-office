import { Ticket } from 'lucide-react';

export interface VoucherFloatingButtonProps {
  onClick: () => void;
}

export const VoucherFloatingButton = ({ onClick }: VoucherFloatingButtonProps) => (
  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
    <button
      onClick={onClick}
      aria-label="Tất Cả Ưu Đãi"
      className="flex items-center gap-2 pl-4 pr-5 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition-colors"
    >
      <Ticket className="w-6 h-6 shrink-0" />
      <span className="font-semibold whitespace-nowrap">Ưu Đãi</span>
    </button>
  </div>
);
