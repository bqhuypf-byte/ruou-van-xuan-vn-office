import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterFormData } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';
import { ROUTES } from '@/routes/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeVoucher, setWelcomeVoucher] = useState<{ code: string; title: string } | null>(null);

  const handleSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      const result = await registerMutation.mutateAsync({
        ...data,
        phone: data.phone || undefined,
      });
      setWelcomeVoucher(result.welcomeVoucher);
      setIsSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), result.welcomeVoucher ? 4000 : 1500);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, t('auth.register.error')));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-3 py-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('auth.register.success')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('auth.register.redirecting')}
        </p>
        {welcomeVoucher && (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-left dark:border-brand-900 dark:bg-brand-950/40">
            <p className="text-sm font-semibold text-brand-900 dark:text-brand-200">
              Ưu đãi thành viên mới: {welcomeVoucher.title}
            </p>
            <p className="mt-2 font-mono text-lg font-bold tracking-wider text-brand-700 dark:text-brand-300">
              {welcomeVoucher.code}
            </p>
            <p className="mt-1 text-xs text-brand-800/80 dark:text-brand-300/80">
              Mã chỉ dùng cho đơn hàng đầu tiên. Hãy lưu lại để sử dụng sau khi đăng nhập.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('auth.register.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('auth.register.subtitle', { site: 'Rượu Vạn Xuân' })}
        </p>
      </div>

      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={registerMutation.isPending}
        errorMessage={errorMessage}
      />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.register.haveAccount')}{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          {t('auth.register.signIn')}
        </Link>
      </p>
    </div>
  );
};
