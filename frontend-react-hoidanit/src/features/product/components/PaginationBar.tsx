import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';

export interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  label: string;
}

export const PaginationBar = ({ page, totalPages, onPrev, onNext, label }: PaginationBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={onPrev}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          {t('common.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page >= totalPages}
          onClick={onNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};
