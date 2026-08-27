import { Ticket } from 'lucide-react';
import { Modal, Spinner } from '@/shared/components/ui';
import { useVouchers } from '../hooks/useVouchers';
import { VoucherCard } from './VoucherCard';

export interface VoucherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherPopup = ({ isOpen, onClose }: VoucherPopupProps) => {
  const { data, isLoading } = useVouchers();
  const vouchers = data ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tất Cả Ưu Đãi"
      description="Sao chép mã và nhập ở trang thanh toán để được giảm giá."
      size="md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : vouchers.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Ticket className="w-7 h-7" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiện chưa có ưu đãi nào, vui lòng quay lại sau.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      )}
    </Modal>
  );
};
