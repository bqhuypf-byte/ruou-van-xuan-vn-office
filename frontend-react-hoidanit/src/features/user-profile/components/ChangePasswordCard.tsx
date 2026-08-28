import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { useChangePassword } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Mật khẩu hiện tại tối thiểu 8 ký tự'),
    newPassword: z.string().min(8, 'Mật khẩu mới tối thiểu 8 ký tự').max(100),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordCard = () => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setFeedback(null);
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setFeedback({ type: 'success', message: 'Đã đổi mật khẩu thành công.' });
      reset();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.'),
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Đổi Mật Khẩu</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cập nhật mật khẩu đăng nhập của bạn.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="password"
          label="Mật khẩu hiện tại"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          type="password"
          label="Mật khẩu mới"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          type="password"
          label="Nhập lại mật khẩu mới"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" isLoading={changePassword.isPending}>
          Đổi Mật Khẩu
        </Button>
      </form>
    </div>
  );
};
