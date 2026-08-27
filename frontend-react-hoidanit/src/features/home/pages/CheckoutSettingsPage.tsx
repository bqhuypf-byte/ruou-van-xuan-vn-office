import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CreditCard, QrCode } from 'lucide-react';
import { Button, Input, Select, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { buildVietQrImageUrl } from '@/shared/utils/vietqr';
import { VIETQR_BANKS } from '@/shared/constants/vietqrBanks';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useUpdateSiteSettings } from '../hooks/useUpdateSiteSettings';

const settingsSchema = z.object({
  shippingFee: z
    .string()
    .min(1, 'Không được để trống')
    .refine((val) => Number(val) >= 0, 'Không được âm'),
  freeShippingThreshold: z
    .string()
    .min(1, 'Không được để trống')
    .refine((val) => Number(val) >= 0, 'Không được âm'),
  codDescription: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  storePickupDescription: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  bankTransferDescription: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  bankName: z.string().max(100, 'Tối đa 100 ký tự').optional(),
  bankAccountNumber: z.string().max(50, 'Tối đa 50 ký tự').optional(),
  bankAccountHolder: z.string().max(100, 'Tối đa 100 ký tự').optional(),
  bankBin: z.string().max(20, 'Tối đa 20 ký tự').optional(),
  checkoutReviewNote: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  checkoutShippingNote: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  checkoutPaymentNote: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  checkoutSummaryNote: z.string().max(255, 'Tối đa 255 ký tự').optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const emptyValues: SettingsFormData = {
  shippingFee: '0',
  freeShippingThreshold: '500000',
  codDescription: '',
  storePickupDescription: '',
  bankTransferDescription: '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountHolder: '',
  bankBin: '',
  checkoutReviewNote: '',
  checkoutShippingNote: '',
  checkoutPaymentNote: '',
  checkoutSummaryNote: '',
};

export const CheckoutSettingsPage = () => {
  const { data: settings, isLoading, isError, error, refetch } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyValues,
  });

  const bankBin = watch('bankBin');
  const bankAccountNumber = watch('bankAccountNumber');
  const bankAccountHolder = watch('bankAccountHolder');
  const bankName = watch('bankName');
  const isKnownBank = VIETQR_BANKS.some((b) => b.bin === bankBin);
  const previewQrUrl =
    bankBin && bankAccountNumber
      ? buildVietQrImageUrl({
          bankBin,
          accountNumber: bankAccountNumber,
          accountName: bankAccountHolder || 'RUOU VAN XUAN',
          amount: 100000,
          content: 'DH_MAUXEM',
        })
      : null;

  const handleBankSelect = (bin: string) => {
    setValue('bankBin', bin, { shouldDirty: true });
    if (!bankName) {
      const bank = VIETQR_BANKS.find((b) => b.bin === bin);
      if (bank) setValue('bankName', bank.name, { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (settings) {
      reset({
        shippingFee: String(Number(settings.shippingFee)),
        freeShippingThreshold: String(Number(settings.freeShippingThreshold)),
        codDescription: settings.codDescription ?? '',
        storePickupDescription: settings.storePickupDescription ?? '',
        bankTransferDescription: settings.bankTransferDescription ?? '',
        bankName: settings.bankName ?? '',
        bankAccountNumber: settings.bankAccountNumber ?? '',
        bankAccountHolder: settings.bankAccountHolder ?? '',
        bankBin: settings.bankBin ?? '',
        checkoutReviewNote: settings.checkoutReviewNote ?? '',
        checkoutShippingNote: settings.checkoutShippingNote ?? '',
        checkoutPaymentNote: settings.checkoutPaymentNote ?? '',
        checkoutSummaryNote: settings.checkoutSummaryNote ?? '',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({
        shippingFee: Number(data.shippingFee),
        freeShippingThreshold: Number(data.freeShippingThreshold),
        codDescription: data.codDescription || undefined,
        storePickupDescription: data.storePickupDescription || undefined,
        bankTransferDescription: data.bankTransferDescription || undefined,
        bankName: data.bankName || undefined,
        bankAccountNumber: data.bankAccountNumber || undefined,
        bankAccountHolder: data.bankAccountHolder || undefined,
        bankBin: data.bankBin || undefined,
        checkoutReviewNote: data.checkoutReviewNote || undefined,
        checkoutShippingNote: data.checkoutShippingNote || undefined,
        checkoutPaymentNote: data.checkoutPaymentNote || undefined,
        checkoutSummaryNote: data.checkoutSummaryNote || undefined,
      });
      setFeedback({ type: 'success', message: 'Đã lưu cấu hình thanh toán thành công.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu cấu hình.') });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-600" />
          Cấu Hình Thanh Toán
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Phí vận chuyển, thông tin chuyển khoản và các lưu ý hiển thị xen giữa các mục trên trang
          thanh toán của khách hàng — tất cả trong một nơi.
        </p>
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
              Không thể tải cấu hình ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Phí Vận Chuyển</h2>
            <Input
              label="Phí vận chuyển (VNĐ)"
              type="number"
              min={0}
              step={1000}
              placeholder="0"
              helperText="Để 0 nếu miễn phí vận chuyển toàn bộ đơn hàng. Nhận tại cửa hàng luôn miễn phí ship."
              error={errors.shippingFee?.message}
              {...register('shippingFee')}
            />
            <Input
              label="Ngưỡng miễn phí vận chuyển (VNĐ)"
              type="number"
              min={0}
              step={10000}
              placeholder="500000"
              helperText="Đơn hàng có tổng giá trị sản phẩm từ mức này trở lên sẽ được miễn phí vận chuyển."
              error={errors.freeShippingThreshold?.message}
              {...register('freeShippingThreshold')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Mô Tả Phương Thức Thanh Toán</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hiển thị dưới tên mỗi phương thức ở trang thanh toán.
            </p>
            <Input
              label="Thanh toán khi nhận hàng (COD)"
              error={errors.codDescription?.message}
              {...register('codDescription')}
            />
            <Input
              label="Nhận tại cửa hàng"
              error={errors.storePickupDescription?.message}
              {...register('storePickupDescription')}
            />
            <Input
              label="Chuyển khoản ngân hàng"
              error={errors.bankTransferDescription?.message}
              {...register('bankTransferDescription')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Thông Tin Chuyển Khoản</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hiển thị cho khách ở trang chi tiết đơn hàng khi họ chọn chuyển khoản. Để trống nếu
              chưa có tài khoản ngân hàng — hệ thống sẽ hướng khách liên hệ hotline thay thế.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Tên ngân hàng"
                placeholder="Vietcombank"
                error={errors.bankName?.message}
                {...register('bankName')}
              />
              <Input
                label="Số tài khoản"
                error={errors.bankAccountNumber?.message}
                {...register('bankAccountNumber')}
              />
              <Input
                label="Chủ tài khoản"
                error={errors.bankAccountHolder?.message}
                {...register('bankAccountHolder')}
              />
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mã QR VietQR
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chọn ngân hàng nhận tiền để hệ thống tự sinh mã QR VietQR hiển thị cho khách ở
                trang chi tiết đơn hàng. Để trống nếu không muốn hiện mã QR (khách vẫn thấy thông
                tin chuyển khoản thủ công).
              </p>
              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <Select
                  label="Ngân hàng nhận VietQR"
                  helperText='Không thấy ngân hàng của bạn? Chọn "Khác" để nhập mã BIN thủ công.'
                  value={isKnownBank ? bankBin : bankBin ? 'custom' : ''}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setValue('bankBin', bankBin && !isKnownBank ? bankBin : '', { shouldDirty: true });
                      return;
                    }
                    if (e.target.value === '') {
                      setValue('bankBin', '', { shouldDirty: true });
                      return;
                    }
                    handleBankSelect(e.target.value);
                  }}
                >
                  <option value="">Không hiển thị mã QR</option>
                  {VIETQR_BANKS.map((bank) => (
                    <option key={bank.bin} value={bank.bin}>
                      {bank.name}
                    </option>
                  ))}
                  <option value="custom">Khác (nhập mã BIN thủ công)</option>
                </Select>
                {!!bankBin && !isKnownBank && (
                  <Input
                    label="Mã BIN ngân hàng"
                    placeholder="970436"
                    helperText="Tra mã BIN tại vietqr.io/danh-sach-ngan-hang."
                    error={errors.bankBin?.message}
                    {...register('bankBin')}
                  />
                )}
              </div>

              {previewQrUrl && (
                <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4">
                  <img
                    src={previewQrUrl}
                    alt="Xem trước mã QR"
                    className="w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white shrink-0"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                    <p className="font-medium text-slate-700 dark:text-slate-300">Xem trước</p>
                    <p>Đây là mã QR mẫu khách sẽ thấy (số tiền và nội dung thực tế sẽ theo từng đơn hàng).</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Lưu Ý Xen Giữa Các Mục</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dòng chữ nhỏ hiển thị ngay dưới mỗi khối trên trang thanh toán. Để trống nếu không
              cần hiển thị.
            </p>
            <Input
              label='Dưới khối "Xác Nhận Sản Phẩm"'
              placeholder="VD: Vui lòng kiểm tra kỹ số lượng trước khi đặt hàng."
              error={errors.checkoutReviewNote?.message}
              {...register('checkoutReviewNote')}
            />
            <Input
              label='Dưới khối "Thông Tin Giao Hàng"'
              placeholder="VD: Đơn hàng chỉ giao trong nội thành, ngoại thành vui lòng liên hệ trước."
              error={errors.checkoutShippingNote?.message}
              {...register('checkoutShippingNote')}
            />
            <Input
              label='Dưới khối "Phương Thức Thanh Toán"'
              placeholder="VD: Không hỗ trợ COD cho đơn hàng trên 5 triệu."
              error={errors.checkoutPaymentNote?.message}
              {...register('checkoutPaymentNote')}
            />
            <Input
              label='Dưới nút "Đặt Hàng" (tóm tắt đơn hàng)'
              error={errors.checkoutSummaryNote?.message}
              {...register('checkoutSummaryNote')}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={updateMutation.isPending}>
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
