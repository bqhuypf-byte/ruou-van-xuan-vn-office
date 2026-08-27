import { useState } from 'react';
import { AlertCircle, MapPinOff, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { AddressCard } from '../components/AddressCard';
import { AddressFormModal } from '../components/AddressFormModal';
import type { AddressFormSubmitData } from '../components/AddressFormModal';
import { AddressDeleteModal } from '../components/AddressDeleteModal';
import { useAddresses } from '../hooks/useAddresses';
import {
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from '../hooks/useAddressMutations';
import type { Address } from '../types/address.types';

export const AddressesPage = () => {
  const { addresses, isLoading, isError, error, refetch } = useAddresses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [defaultingId, setDefaultingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const handleOpenCreate = () => {
    setSelectedAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (address: Address) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: AddressFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedAddress) {
        await updateMutation.mutateAsync({ id: selectedAddress.id, input: data });
        setFeedback({ type: 'success', message: 'Đã cập nhật địa chỉ thành công.' });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: 'Đã thêm địa chỉ thành công.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu địa chỉ.') });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAddress) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedAddress.id);
      setFeedback({ type: 'success', message: 'Đã xóa địa chỉ thành công.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa địa chỉ.') });
    }
  };

  const handleSetDefault = async (address: Address) => {
    setFeedback(null);
    setDefaultingId(address.id);
    try {
      await setDefaultMutation.mutateAsync(address.id);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Không thể đặt làm địa chỉ mặc định.'),
      });
    } finally {
      setDefaultingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Địa Chỉ Của Tôi
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Quản lý địa chỉ giao hàng của bạn.
            </p>
          </div>
          <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />} size="md">
            Thêm Địa Chỉ
          </Button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs font-medium hover:underline ml-4">
              Đóng
            </button>
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                Không thể tải danh sách địa chỉ ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử Lại
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPinOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Bạn chưa có địa chỉ nào
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Thêm địa chỉ để chuẩn bị cho việc đặt hàng.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onSetDefault={handleSetDefault}
                isSettingDefault={defaultingId === address.id && setDefaultMutation.isPending}
              />
            ))}
          </div>
        )}

        <AddressFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSaveForm}
          addressToEdit={selectedAddress}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <AddressDeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          addressToDelete={selectedAddress}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};
