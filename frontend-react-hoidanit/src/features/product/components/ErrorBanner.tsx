import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui';

export interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {t('common.tryAgain')}
      </Button>
    </div>
  );
};
