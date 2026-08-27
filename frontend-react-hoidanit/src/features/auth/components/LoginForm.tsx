import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';

const buildLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('auth.form.emailRequired')).email(t('auth.form.emailInvalid')),
    password: z.string().min(8, t('auth.form.passwordMin')),
  });

export type LoginFormData = z.infer<ReturnType<typeof buildLoginSchema>>;

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const LoginForm = ({ onSubmit, isLoading = false, errorMessage }: LoginFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(buildLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMessage && (
        <div className="p-3 rounded-lg text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {errorMessage}
        </div>
      )}

      <Input
        label={t('auth.form.email')}
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label={t('auth.form.password')}
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {t('auth.login.submit')}
      </Button>
    </form>
  );
};
