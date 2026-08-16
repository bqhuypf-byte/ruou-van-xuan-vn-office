import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterFormData } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';
import { ROUTES } from '@/routes/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerMutation.mutateAsync({
        ...data,
        phone: data.phone || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 1500);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-3 py-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Đăng Ký Thành Công</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Đang chuyển hướng đến trang đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tạo Tài Khoản</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Đăng ký để bắt đầu mua sắm tại hoidanit-ecommerce.
        </p>
      </div>

      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={registerMutation.isPending}
        errorMessage={errorMessage}
      />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Đã có tài khoản?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};
