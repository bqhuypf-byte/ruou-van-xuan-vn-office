import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Plus, Settings, Trash2 } from 'lucide-react';
import { Button, Input, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useUpdateSiteSettings } from '../hooks/useUpdateSiteSettings';

const footerLinkSchema = z.object({
  label: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  url: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
});

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  logoUrl: z.string().max(500).optional(),
  topBarMessage: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  deliverToText: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  contactPhone: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  whatsappNumber: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  appStoreUrl: z.string().max(500).optional(),
  playStoreUrl: z.string().max(500).optional(),
  copyrightText: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  popularCategoriesTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  popularCategoriesLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  customerServiceTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  customerServiceLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const emptyValues: SettingsFormData = {
  siteName: '',
  logoUrl: '',
  topBarMessage: '',
  deliverToText: '',
  contactPhone: '',
  whatsappNumber: '',
  appStoreUrl: '',
  playStoreUrl: '',
  copyrightText: '',
  popularCategoriesTitle: '',
  popularCategoriesLinks: [],
  customerServiceTitle: '',
  customerServiceLinks: [],
};

export const SiteSettingsPage = () => {
  const { data: settings, isLoading, isError, error, refetch } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyValues,
  });

  const popularLinksArray = useFieldArray({ control, name: 'popularCategoriesLinks' });
  const serviceLinksArray = useFieldArray({ control, name: 'customerServiceLinks' });

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName,
        logoUrl: settings.logoUrl ?? '',
        topBarMessage: settings.topBarMessage,
        deliverToText: settings.deliverToText,
        contactPhone: settings.contactPhone,
        whatsappNumber: settings.whatsappNumber,
        appStoreUrl: settings.appStoreUrl ?? '',
        playStoreUrl: settings.playStoreUrl ?? '',
        copyrightText: settings.copyrightText,
        popularCategoriesTitle: settings.popularCategoriesTitle,
        popularCategoriesLinks: settings.popularCategoriesLinks,
        customerServiceTitle: settings.customerServiceTitle,
        customerServiceLinks: settings.customerServiceLinks,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({
        ...data,
        logoUrl: data.logoUrl || undefined,
        appStoreUrl: data.appStoreUrl || undefined,
        playStoreUrl: data.playStoreUrl || undefined,
      });
      setFeedback({ type: 'success', message: 'Đã lưu cấu hình thương hiệu thành công.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu cấu hình.') });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Cấu Hình Thương Hiệu
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Đổi tên site, logo, thông tin liên hệ và các liên kết footer — dùng khi bàn giao site cho
          chủ sở hữu khác mà không cần sửa code.
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
            <h2 className="font-semibold text-slate-900 dark:text-white">Thương hiệu</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Tên site" error={errors.siteName?.message} {...register('siteName')} />
              <Input
                label="Logo (URL)"
                placeholder="https://..."
                error={errors.logoUrl?.message}
                {...register('logoUrl')}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Thông báo thanh trên cùng"
                placeholder="Welcome to worldwide MegaMart!"
                error={errors.topBarMessage?.message}
                {...register('topBarMessage')}
              />
              <Input
                label="Chữ giao hàng đến"
                placeholder="Deliver to 423651"
                error={errors.deliverToText?.message}
                {...register('deliverToText')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Liên hệ &amp; Ứng dụng</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Số điện thoại"
                error={errors.contactPhone?.message}
                {...register('contactPhone')}
              />
              <Input
                label="Số WhatsApp"
                error={errors.whatsappNumber?.message}
                {...register('whatsappNumber')}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Link App Store"
                placeholder="https://apps.apple.com/..."
                error={errors.appStoreUrl?.message}
                {...register('appStoreUrl')}
              />
              <Input
                label="Link Google Play"
                placeholder="https://play.google.com/..."
                error={errors.playStoreUrl?.message}
                {...register('playStoreUrl')}
              />
            </div>
            <Input
              label="Chữ bản quyền footer"
              error={errors.copyrightText?.message}
              {...register('copyrightText')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Cột "Danh Mục Phổ Biến" (footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => popularLinksArray.append({ label: '', url: '/products' })}
                disabled={popularLinksArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <Input
              label="Tiêu đề cột"
              error={errors.popularCategoriesTitle?.message}
              {...register('popularCategoriesTitle')}
            />
            <div className="space-y-3">
              {popularLinksArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.popularCategoriesLinks?.[index]?.label?.message}
                    {...register(`popularCategoriesLinks.${index}.label`)}
                  />
                  <Input
                    placeholder="/products"
                    error={errors.popularCategoriesLinks?.[index]?.url?.message}
                    {...register(`popularCategoriesLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => popularLinksArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {popularLinksArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Cột "Chăm Sóc Khách Hàng" (footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => serviceLinksArray.append({ label: '', url: '/' })}
                disabled={serviceLinksArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <Input
              label="Tiêu đề cột"
              error={errors.customerServiceTitle?.message}
              {...register('customerServiceTitle')}
            />
            <div className="space-y-3">
              {serviceLinksArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.customerServiceLinks?.[index]?.label?.message}
                    {...register(`customerServiceLinks.${index}.label`)}
                  />
                  <Input
                    placeholder="/faq"
                    error={errors.customerServiceLinks?.[index]?.url?.message}
                    {...register(`customerServiceLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => serviceLinksArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {serviceLinksArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
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
