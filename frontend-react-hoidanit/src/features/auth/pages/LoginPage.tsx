import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import type { LoginFormData } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/routes/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(data);
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, 'Email hoặc mật khẩu không đúng.'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Đăng Nhập</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chào mừng bạn quay lại hoidanit-ecommerce.
        </p>
      </div>

      <LoginForm
        onSubmit={handleSubmit}
        isLoading={loginMutation.isPending}
        errorMessage={errorMessage}
      />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Chưa có tài khoản?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};
