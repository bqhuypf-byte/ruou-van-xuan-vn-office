import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import type { LoginFormData } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/routes/routes';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useMergeCart } from '@/features/cart';

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const mergeCartMutation = useMergeCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(data);
      try {
        await mergeCartMutation.mutateAsync();
      } catch {
        // Best-effort: a guest cart may not exist, or the merge may fail transiently.
        // Login itself already succeeded, so we don't block navigation on this.
      }
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err, t('auth.login.error')));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('auth.login.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('auth.login.subtitle', { site: 'Rượu Vạn Xuân' })}
        </p>
      </div>

      <LoginForm
        onSubmit={handleSubmit}
        isLoading={loginMutation.isPending}
        errorMessage={errorMessage}
      />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.login.noAccount')}{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          {t('auth.login.registerNow')}
        </Link>
      </p>
    </div>
  );
};
