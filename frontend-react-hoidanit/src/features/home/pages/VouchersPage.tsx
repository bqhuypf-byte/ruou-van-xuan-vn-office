import { useMemo, useState } from 'react';
import { AlertCircle, BadgePercent, CircleCheckBig, Plus, Ticket } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { VoucherTable } from '../components/VoucherTable';
import { VoucherFormModal } from '../components/VoucherFormModal';
import type { VoucherFormSubmitData } from '../components/VoucherFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAdminVouchers } from '../hooks/useVouchers';
import { useCreateVoucher, useDeleteVoucher, useUpdateVoucher } from '../hooks/useVoucherMutations';
import type { Voucher } from '../types/home.types';

export const VouchersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminVouchers();
  const vouchers = useMemo(() => data ?? [], [data]);
  const voucherStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const available = vouchers.filter(
      (voucher) =>
        voucher.isActive &&
        (!voucher.startDate || voucher.startDate <= today) &&
        (!voucher.endDate || voucher.endDate >= today),
    ).length;

    return {
      total: vouchers.length,
      available,
      unavailable: vouchers.length - available,
    };
  }, [vouchers]);

  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher();

  const handleOpenCreate = () => {
    setSelectedVoucher(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: VoucherFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedVoucher) {
        await updateMutation.mutateAsync({
          id: selectedVoucher.id,
          input: data,
        });
        setFeedback({
          type: 'success',
          message: `Đã cập nhật voucher "${data.code}".`,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          description: data.description ?? undefined,
          maxDiscountAmount: data.maxDiscountAmount ?? undefined,
          startDate: data.startDate ?? undefined,
          endDate: data.endDate ?? undefined,
        });
        setFeedback({
          type: 'success',
          message: `Đã tạo voucher "${data.code}".`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu voucher.'),
      });
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVoucher) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedVoucher.id);
      setFeedback({
        type: 'success',
        message: `Đã xóa voucher "${selectedVoucher.code}".`,
      });
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa voucher.'),
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-600" />
            Voucher / Ưu Đãi
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Voucher đang áp dụng sẽ được công khai và tự động xét cho giỏ hàng đủ điều kiện.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Voucher
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-medium hover:underline ml-4"
          >
            Đóng
          </button>
        </div>
      )}

      {isError && (
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải danh sách voucher (
              {error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Tổng ưu đãi',
            value: voucherStats.total,
            icon: Ticket,
            tone: 'text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-brand-950/40',
          },
          {
            label: 'Có thể tự áp dụng',
            value: voucherStats.available,
            icon: CircleCheckBig,
            tone: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40',
          },
          {
            label: 'Tạm dừng / ngoài hạn',
            value: voucherStats.unavailable,
            icon: BadgePercent,
            tone: 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <VoucherTable
        vouchers={vouchers}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <VoucherFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        voucherToEdit={selectedVoucher}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedVoucher?.code ?? ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
