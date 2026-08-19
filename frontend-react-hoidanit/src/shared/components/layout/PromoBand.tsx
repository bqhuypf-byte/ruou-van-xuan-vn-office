import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';

export interface PromoBandProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const PromoBand = ({
  title = 'Đừng bỏ lỡ các ưu đãi rượu vang mới nhất',
  ctaText = 'Xem Ưu Đãi',
  ctaLink = ROUTES.PRODUCTS,
}: PromoBandProps) => {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <h2 className="text-lg sm:text-xl font-bold text-white text-center sm:text-left">
          {title}
        </h2>
        <Button
          size="lg"
          className="rounded-full px-8 shrink-0"
          onClick={() => navigate(ctaLink)}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
};
