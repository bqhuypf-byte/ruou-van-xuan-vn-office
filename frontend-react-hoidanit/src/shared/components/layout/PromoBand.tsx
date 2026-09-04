import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';

export interface PromoBandProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const PromoBand = ({ title, ctaText, ctaLink = ROUTES.PRODUCTS }: PromoBandProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="bg-brand-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <h2 className="text-lg sm:text-xl font-bold text-gold-200 text-center sm:text-left">
          {title ?? t('promo.title')}
        </h2>
        <Button
          size="lg"
          className="rounded-full px-8 shrink-0 bg-gold-500 hover:bg-gold-600 text-brand-950"
          onClick={() => navigate(ctaLink)}
        >
          {ctaText ?? t('promo.cta')}
        </Button>
      </div>
    </section>
  );
};
