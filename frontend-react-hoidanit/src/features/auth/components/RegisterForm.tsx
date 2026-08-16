import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống').max(100, 'Họ tên tối đa 100 ký tự'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  phone: z.string().max(20, 'Số điện thoại tối đa 20 ký tự').optional().or(z.literal('')),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').max(100, 'Mật khẩu tối đa 100 ký tự'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Số điện thoại (tùy chọn)"
        placeholder="0901234567"
        leftIcon={<Phone className="w-4 h-4" />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Đăng Ký
      </Button>
    </form>
  );
};
