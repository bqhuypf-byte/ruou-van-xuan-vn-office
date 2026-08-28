import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Controller,
  useForm,
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, ArrowRight, CreditCard, MapPin, Plus, Settings, Trash2 } from 'lucide-react';
import { Button, ImageDropzone, Input, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { ROUTES } from '@/routes/routes';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useUpdateSiteSettings } from '../hooks/useUpdateSiteSettings';

const footerLinkSchema = z.object({
  label: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  url: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
});

const contactAddressSchema = z.object({
  label: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  address: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
});

const trustBadgeSchema = z.object({
  icon: z.string().min(1, 'Bắt buộc').max(50, 'Tối đa 50 ký tự'),
  title: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  description: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
});

const paymentMethodIconSchema = z.object({
  name: z.string().min(1, 'Bắt buộc').max(50, 'Tối đa 50 ký tự'),
  iconUrl: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
});

const contactChannelLocationSchema = z.object({
  label: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  link: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
});

const contactChannelSchema = z.object({
  icon: z.string().min(1, 'Bắt buộc').max(50, 'Tối đa 50 ký tự'),
  label: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  hours: z.string().min(1, 'Bắt buộc').max(50, 'Tối đa 50 ký tự'),
  link: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
  bgColor: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  isActive: z.boolean(),
  locations: z.array(contactChannelLocationSchema).max(20, 'Tối đa 20 mục').optional(),
});

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  logoUrl: z.string().max(500).optional(),
  browserTitle: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  faviconUrl: z.string().max(500).optional(),
  topBarMessage: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  deliverToText: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  contactPhone: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  whatsappNumber: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  contactAddresses: z.array(contactAddressSchema).max(20, 'Tối đa 20 mục'),
  facebookUrl: z.string().max(500, 'Tối đa 500 ký tự').optional(),
  zaloUrl: z.string().max(500, 'Tối đa 500 ký tự').optional(),
  appStoreUrl: z.string().max(500).optional(),
  playStoreUrl: z.string().max(500).optional(),
  copyrightText: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  footerDescription: z.string().max(500, 'Tối đa 500 ký tự').optional(),
  dealsSectionTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  featuredBrandsSectionTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  topCategoriesSectionTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  popularCategoriesTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  popularCategoriesLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  customerServiceTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  customerServiceLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  footerAboutTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  footerAboutLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  footerServicesTitle: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  footerServicesLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  footerBottomLinks: z.array(footerLinkSchema).max(20, 'Tối đa 20 mục'),
  trustBadges: z.array(trustBadgeSchema).max(20, 'Tối đa 20 mục'),
  paymentMethodIcons: z.array(paymentMethodIconSchema).max(20, 'Tối đa 20 mục'),
  contactChannels: z.array(contactChannelSchema).max(20, 'Tối đa 20 mục'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const emptyValues: SettingsFormData = {
  siteName: '',
  logoUrl: '',
  browserTitle: '',
  faviconUrl: '',
  topBarMessage: '',
  deliverToText: '',
  contactPhone: '',
  whatsappNumber: '',
  contactAddresses: [],
  facebookUrl: '',
  zaloUrl: '',
  appStoreUrl: '',
  playStoreUrl: '',
  copyrightText: '',
  footerDescription: '',
  dealsSectionTitle: '',
  featuredBrandsSectionTitle: '',
  topCategoriesSectionTitle: '',
  popularCategoriesTitle: '',
  popularCategoriesLinks: [],
  customerServiceTitle: '',
  customerServiceLinks: [],
  footerAboutTitle: '',
  footerAboutLinks: [],
  footerServicesTitle: '',
  footerServicesLinks: [],
  footerBottomLinks: [],
  trustBadges: [],
  paymentMethodIcons: [],
  contactChannels: [],
};

interface ContactChannelLocationsEditorProps {
  control: Control<SettingsFormData>;
  register: UseFormRegister<SettingsFormData>;
  channelIndex: number;
  errors: FieldErrors<SettingsFormData>;
}

const ContactChannelLocationsEditor = ({
  control,
  register,
  channelIndex,
  errors,
}: ContactChannelLocationsEditorProps) => {
  const locationsArray = useFieldArray({
    control,
    name: `contactChannels.${channelIndex}.locations`,
  });

  return (
    <div className="col-span-full pl-2 border-l-2 border-slate-200 dark:border-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          Danh sách vị trí (nếu có nhiều cửa hàng, hiển thị để khách chọn khi bấm vào kênh này)
        </p>
        <button
          type="button"
          onClick={() => locationsArray.append({ label: '', link: '' })}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
          disabled={locationsArray.fields.length >= 20}
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm vị trí
        </button>
      </div>
      {locationsArray.fields.map((locField, locIndex) => (
        <div key={locField.id} className="flex items-start gap-2">
          <Input
            placeholder="Tên cửa hàng (VD: Chi nhánh 1)"
            error={errors.contactChannels?.[channelIndex]?.locations?.[locIndex]?.label?.message}
            {...register(`contactChannels.${channelIndex}.locations.${locIndex}.label`)}
          />
          <Input
            placeholder="Link vị trí (Google Maps...)"
            error={errors.contactChannels?.[channelIndex]?.locations?.[locIndex]?.link?.message}
            {...register(`contactChannels.${channelIndex}.locations.${locIndex}.link`)}
          />
          <button
            type="button"
            onClick={() => locationsArray.remove(locIndex)}
            className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
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

  const contactAddressesArray = useFieldArray({ control, name: 'contactAddresses' });
  const popularLinksArray = useFieldArray({ control, name: 'popularCategoriesLinks' });
  const serviceLinksArray = useFieldArray({ control, name: 'customerServiceLinks' });
  const aboutLinksArray = useFieldArray({ control, name: 'footerAboutLinks' });
  const servicesLinksArray = useFieldArray({ control, name: 'footerServicesLinks' });
  const bottomLinksArray = useFieldArray({ control, name: 'footerBottomLinks' });
  const trustBadgesArray = useFieldArray({ control, name: 'trustBadges' });
  const paymentIconsArray = useFieldArray({ control, name: 'paymentMethodIcons' });
  const contactChannelsArray = useFieldArray({ control, name: 'contactChannels' });

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName,
        logoUrl: settings.logoUrl ?? '',
        browserTitle: settings.browserTitle ?? '',
        faviconUrl: settings.faviconUrl ?? '',
        topBarMessage: settings.topBarMessage,
        deliverToText: settings.deliverToText,
        contactPhone: settings.contactPhone,
        whatsappNumber: settings.whatsappNumber,
        contactAddresses: settings.contactAddresses ?? [],
        facebookUrl: settings.facebookUrl ?? '',
        zaloUrl: settings.zaloUrl ?? '',
        appStoreUrl: settings.appStoreUrl ?? '',
        playStoreUrl: settings.playStoreUrl ?? '',
        copyrightText: settings.copyrightText,
        footerDescription: settings.footerDescription ?? '',
        dealsSectionTitle: settings.dealsSectionTitle,
        featuredBrandsSectionTitle: settings.featuredBrandsSectionTitle,
        topCategoriesSectionTitle: settings.topCategoriesSectionTitle,
        popularCategoriesTitle: settings.popularCategoriesTitle,
        popularCategoriesLinks: settings.popularCategoriesLinks,
        customerServiceTitle: settings.customerServiceTitle,
        customerServiceLinks: settings.customerServiceLinks,
        footerAboutTitle: settings.footerAboutTitle,
        footerAboutLinks: settings.footerAboutLinks ?? [],
        footerServicesTitle: settings.footerServicesTitle,
        footerServicesLinks: settings.footerServicesLinks ?? [],
        footerBottomLinks: settings.footerBottomLinks ?? [],
        trustBadges: settings.trustBadges,
        paymentMethodIcons: settings.paymentMethodIcons,
        contactChannels: settings.contactChannels,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({
        ...data,
        logoUrl: data.logoUrl || undefined,
        browserTitle: data.browserTitle || undefined,
        faviconUrl: data.faviconUrl || undefined,
        facebookUrl: data.facebookUrl || undefined,
        zaloUrl: data.zaloUrl || undefined,
        appStoreUrl: data.appStoreUrl || undefined,
        playStoreUrl: data.playStoreUrl || undefined,
        footerDescription: data.footerDescription || undefined,
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
          <Settings className="w-6 h-6 text-brand-600" />
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
              <Controller
                name="logoUrl"
                control={control}
                render={({ field }) => (
                  <ImageDropzone
                    label="Logo"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.logoUrl?.message}
                  />
                )}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Tiêu đề tab trình duyệt"
                placeholder="Rượu Vạn Xuân - Rượu Nếp, Rượu Ngâm, Rượu Gạo Truyền Thống"
                helperText="Chữ hiện trên tab trình duyệt và kết quả tìm kiếm Google."
                error={errors.browserTitle?.message}
                {...register('browserTitle')}
              />
              <Controller
                name="faviconUrl"
                control={control}
                render={({ field }) => (
                  <ImageDropzone
                    label="Icon tab trình duyệt (favicon)"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.faviconUrl?.message}
                  />
                )}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Thông báo thanh trên cùng"
                placeholder="Chào mừng đến với Rượu Vạn Xuân!"
                error={errors.topBarMessage?.message}
                {...register('topBarMessage')}
              />
              <Input
                label="Chữ giao hàng đến"
                placeholder="Giao Hàng Toàn Quốc"
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Địa chỉ liên hệ
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => contactAddressesArray.append({ label: '', address: '' })}
                  disabled={contactAddressesArray.fields.length >= 20}
                >
                  Thêm chi nhánh
                </Button>
              </div>
              <div className="space-y-3">
                {contactAddressesArray.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3">
                    <Input
                      placeholder="Chi nhánh 1"
                      error={errors.contactAddresses?.[index]?.label?.message}
                      {...register(`contactAddresses.${index}.label`)}
                    />
                    <Input
                      placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                      error={errors.contactAddresses?.[index]?.address?.message}
                      {...register(`contactAddresses.${index}.address`)}
                    />
                    <button
                      type="button"
                      onClick={() => contactAddressesArray.remove(index)}
                      className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {contactAddressesArray.fields.length === 0 && (
                  <p className="text-sm text-slate-400">Chưa có địa chỉ nào.</p>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Link Facebook"
                placeholder="https://facebook.com/..."
                error={errors.facebookUrl?.message}
                {...register('facebookUrl')}
              />
              <Input
                label="Link Zalo"
                placeholder="https://zalo.me/..."
                error={errors.zaloUrl?.message}
                {...register('zaloUrl')}
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
            <Input
              label="Mô tả ngắn (footer)"
              placeholder="Giới thiệu ngắn gọn về cửa hàng, hiển thị dưới logo ở footer"
              error={errors.footerDescription?.message}
              {...register('footerDescription')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Tiêu Đề Các Khối Trên Trang Chủ</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tên các mục hiển thị ở phần nội dung (body) trang chủ.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label='Khối "Ưu Đãi Nổi Bật"'
                error={errors.dealsSectionTitle?.message}
                {...register('dealsSectionTitle')}
              />
              <Input
                label='Khối "Thương Hiệu Nổi Bật"'
                error={errors.featuredBrandsSectionTitle?.message}
                {...register('featuredBrandsSectionTitle')}
              />
              <Input
                label='Khối "Danh Mục Nổi Bật"'
                error={errors.topCategoriesSectionTitle?.message}
                {...register('topCategoriesSectionTitle')}
              />
            </div>
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

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Cột "Về Chúng Tôi" (footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => aboutLinksArray.append({ label: '', url: '/about' })}
                disabled={aboutLinksArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <Input
              label="Tiêu đề cột"
              error={errors.footerAboutTitle?.message}
              {...register('footerAboutTitle')}
            />
            <div className="space-y-3">
              {aboutLinksArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.footerAboutLinks?.[index]?.label?.message}
                    {...register(`footerAboutLinks.${index}.label`)}
                  />
                  <Input
                    placeholder="/about"
                    error={errors.footerAboutLinks?.[index]?.url?.message}
                    {...register(`footerAboutLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => aboutLinksArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {aboutLinksArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Cột "Dịch Vụ" (footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => servicesLinksArray.append({ label: '', url: '/' })}
                disabled={servicesLinksArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <Input
              label="Tiêu đề cột"
              error={errors.footerServicesTitle?.message}
              {...register('footerServicesTitle')}
            />
            <div className="space-y-3">
              {servicesLinksArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.footerServicesLinks?.[index]?.label?.message}
                    {...register(`footerServicesLinks.${index}.label`)}
                  />
                  <Input
                    placeholder="/gift-card"
                    error={errors.footerServicesLinks?.[index]?.url?.message}
                    {...register(`footerServicesLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => servicesLinksArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {servicesLinksArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Liên Kết Hàng Dưới Cùng (footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => bottomLinksArray.append({ label: '', url: '/' })}
                disabled={bottomLinksArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Các liên kết nhỏ hiển thị ở dòng cuối cùng của footer, cạnh dòng bản quyền.
            </p>
            <div className="space-y-3">
              {bottomLinksArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.footerBottomLinks?.[index]?.label?.message}
                    {...register(`footerBottomLinks.${index}.label`)}
                  />
                  <Input
                    placeholder="/terms"
                    error={errors.footerBottomLinks?.[index]?.url?.message}
                    {...register(`footerBottomLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => bottomLinksArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {bottomLinksArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Cam Kết Dịch Vụ (Trust Badges)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => trustBadgesArray.append({ icon: 'Truck', title: '', description: '' })}
                disabled={trustBadgesArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <div className="space-y-3">
              {trustBadgesArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Tên icon (Truck, ShieldCheck, ...)"
                    error={errors.trustBadges?.[index]?.icon?.message}
                    {...register(`trustBadges.${index}.icon`)}
                  />
                  <Input
                    placeholder="Tiêu đề"
                    error={errors.trustBadges?.[index]?.title?.message}
                    {...register(`trustBadges.${index}.title`)}
                  />
                  <Input
                    placeholder="Mô tả"
                    error={errors.trustBadges?.[index]?.description?.message}
                    {...register(`trustBadges.${index}.description`)}
                  />
                  <button
                    type="button"
                    onClick={() => trustBadgesArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {trustBadgesArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Biểu Tượng Thanh Toán (Footer)</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => paymentIconsArray.append({ name: '', iconUrl: '' })}
                disabled={paymentIconsArray.fields.length >= 20}
              >
                Thêm
              </Button>
            </div>
            <div className="space-y-3">
              {paymentIconsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Tên (Visa, Momo, ...)"
                    error={errors.paymentMethodIcons?.[index]?.name?.message}
                    {...register(`paymentMethodIcons.${index}.name`)}
                  />
                  <Input
                    placeholder="URL ảnh icon"
                    error={errors.paymentMethodIcons?.[index]?.iconUrl?.message}
                    {...register(`paymentMethodIcons.${index}.iconUrl`)}
                  />
                  <button
                    type="button"
                    onClick={() => paymentIconsArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {paymentIconsArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có mục nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Popup Liên Hệ Nổi (Trang Chủ)
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Danh sách kênh chat hiển thị trong popup góc dưới bên phải trang chủ (Messenger,
                  Zalo, hotline, cửa hàng...).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() =>
                  contactChannelsArray.append({
                    icon: 'MessageCircle',
                    label: '',
                    hours: '8h - 20h',
                    link: '',
                    bgColor: '#0084FF',
                    isActive: true,
                    locations: [],
                  })
                }
                disabled={contactChannelsArray.fields.length >= 20}
              >
                Thêm Kênh
              </Button>
            </div>
            <div className="space-y-3">
              {contactChannelsArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_100px_80px_auto] gap-2.5 items-start pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <Input
                    placeholder="Icon (MessageCircle, Send, Phone, Store...)"
                    error={errors.contactChannels?.[index]?.icon?.message}
                    {...register(`contactChannels.${index}.icon`)}
                  />
                  <Input
                    placeholder="Nhãn hiển thị"
                    error={errors.contactChannels?.[index]?.label?.message}
                    {...register(`contactChannels.${index}.label`)}
                  />
                  <Input
                    placeholder="Link (https://... hoặc tel:...)"
                    error={errors.contactChannels?.[index]?.link?.message}
                    {...register(`contactChannels.${index}.link`)}
                  />
                  <Input
                    placeholder="Giờ hoạt động"
                    error={errors.contactChannels?.[index]?.hours?.message}
                    {...register(`contactChannels.${index}.hours`)}
                  />
                  <input
                    type="color"
                    className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                    {...register(`contactChannels.${index}.bgColor`)}
                  />
                  <div className="flex items-center gap-2 h-10">
                    <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
                        {...register(`contactChannels.${index}.isActive`)}
                      />
                      Bật
                    </label>
                    <button
                      type="button"
                      onClick={() => contactChannelsArray.remove(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <ContactChannelLocationsEditor
                    control={control}
                    register={register}
                    errors={errors}
                    channelIndex={index}
                  />
                </div>
              ))}
              {contactChannelsArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có kênh liên hệ nào.</p>
              )}
            </div>
          </div>

          <Link
            to={ROUTES.ADMIN_CHECKOUT_SETTINGS}
            className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Cấu Hình Thanh Toán (Checkout)
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Phí vận chuyển, thông tin chuyển khoản và các lưu ý trên trang thanh toán — quản
                  lý riêng tại đây.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

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
