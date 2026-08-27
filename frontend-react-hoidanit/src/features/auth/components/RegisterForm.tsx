import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';

const buildRegisterSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(1, t('auth.form.fullNameRequired'))
      .max(100, t('auth.form.fullNameMax')),
    email: z.string().min(1, t('auth.form.emailRequired')).email(t('auth.form.emailInvalid')),
    phone: z.string().max(20, t('auth.form.phoneMax')).optional().or(z.literal('')),
    password: z
      .string()
      .min(8, t('auth.form.passwordMin'))
      .max(100, t('auth.form.passwordMax')),
  });

export type RegisterFormData = z.infer<ReturnType<typeof buildRegisterSchema>>;

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
  errorMessage,
}: RegisterFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(buildRegisterSchema(t)),
    defaultValues: { fullName: '', email: '', phone: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMessage && (
        <div className="p-3 rounded-lg text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {errorMessage}
        </div>
      )}

      <Input
        label={t('auth.form.fullName')}
        placeholder={t('auth.form.fullNamePlaceholder')}
        leftIcon={<User className="w-4 h-4" />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label={t('auth.form.email')}
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label={t('auth.form.phone')}
        placeholder="0901234567"
        leftIcon={<Phone className="w-4 h-4" />}
        error={errors.phone?.message}
        {...register('phone')}
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
        {t('auth.register.submit')}
      </Button>
    </form>
  );
};
