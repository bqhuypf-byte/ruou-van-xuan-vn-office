import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { Button, Input, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useHomepageContent } from '../hooks/useHomepageContent';
import { useUpdateHomepageContent } from '../hooks/useUpdateHomepageContent';

const statSchema = z.object({
  value: z.string().min(1, 'Bắt buộc').max(20, 'Tối đa 20 ký tự'),
  label: z.string().min(1, 'Bắt buộc').max(50, 'Tối đa 50 ký tự'),
});

const brandSchema = z.object({
  name: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
});

const contentSchema = z.object({
  headline: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  subtitle: z.string().min(1, 'Bắt buộc').max(1000, 'Tối đa 1000 ký tự'),
  ctaText: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  ctaLink: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  stats: z.array(statSchema).max(6, 'Tối đa 6 số liệu'),
  brands: z.array(brandSchema).max(12, 'Tối đa 12 thương hiệu'),
});

type ContentFormData = z.infer<typeof contentSchema>;

export const SiteContentPage = () => {
  const { data: content, isLoading, isError, error, refetch } = useHomepageContent();
  const updateMutation = useUpdateHomepageContent();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: { headline: '', subtitle: '', ctaText: '', ctaLink: '', stats: [], brands: [] },
  });

  const statsArray = useFieldArray({ control, name: 'stats' });
  const brandsArray = useFieldArray({ control, name: 'brands' });

  useEffect(() => {
    if (content) {
      reset({
        headline: content.headline,
        subtitle: content.subtitle,
        ctaText: content.ctaText,
        ctaLink: content.ctaLink,
        stats: content.stats,
        brands: content.partnerBrands.map((name) => ({ name })),
      });
    }
  }, [content, reset]);

  const onSubmit = async (data: ContentFormData) => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({
        headline: data.headline,
        subtitle: data.subtitle,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        stats: data.stats,
        partnerBrands: data.brands.map((b) => b.name),
      });
      setFeedback({ type: 'success', message: 'Đã lưu nội dung trang chủ thành công.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu nội dung.'),
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Nội Dung Trang Chủ
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa tiêu đề, mô tả, nút kêu gọi hành động, số liệu nổi bật và dải thương hiệu đối
          tác hiển thị ở trang chủ.
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
              Không thể tải nội dung ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
            <h2 className="font-semibold text-slate-900 dark:text-white">Hero</h2>

            <div className="w-full space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tiêu đề chính
              </label>
              <textarea
                rows={2}
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register('headline')}
              />
              {errors.headline && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.headline.message}</p>
              )}
            </div>

            <div className="w-full space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mô tả phụ
              </label>
              <textarea
                rows={3}
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
                {...register('subtitle')}
              />
              {errors.subtitle && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.subtitle.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nút CTA - Nội dung"
                placeholder="Mua Ngay"
                error={errors.ctaText?.message}
                {...register('ctaText')}
              />
              <Input
                label="Nút CTA - Liên kết"
                placeholder="/products"
                error={errors.ctaLink?.message}
                {...register('ctaLink')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Số liệu nổi bật</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => statsArray.append({ value: '', label: '' })}
                disabled={statsArray.fields.length >= 6}
              >
                Thêm
              </Button>
            </div>
            {errors.stats?.message && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{errors.stats.message}</p>
            )}
            <div className="space-y-3">
              {statsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="200+"
                    className="w-32"
                    error={errors.stats?.[index]?.value?.message}
                    {...register(`stats.${index}.value`)}
                  />
                  <Input
                    placeholder="Nhà sản xuất"
                    error={errors.stats?.[index]?.label?.message}
                    {...register(`stats.${index}.label`)}
                  />
                  <button
                    type="button"
                    onClick={() => statsArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {statsArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có số liệu nào.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Thương hiệu đối tác</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => brandsArray.append({ name: '' })}
                disabled={brandsArray.fields.length >= 12}
              >
                Thêm
              </Button>
            </div>
            <div className="space-y-3">
              {brandsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <Input
                    placeholder="Château Margaux"
                    error={errors.brands?.[index]?.name?.message}
                    {...register(`brands.${index}.name`)}
                  />
                  <button
                    type="button"
                    onClick={() => brandsArray.remove(index)}
                    className="mt-2 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {brandsArray.fields.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có thương hiệu nào.</p>
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
