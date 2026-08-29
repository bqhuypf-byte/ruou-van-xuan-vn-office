import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useBanners, useSiteSettings, TrustBadgeStrip, FaqAccordion } from '@/features/home';
import { DealsSection } from '../components/DealsSection';
import { useHomepageSections, toSectionDeal } from '../hooks/useHomepageSections';
import type { FeaturedDeal } from '../hooks/useFeaturedDeals';

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);

  const { sections } = useHomepageSections();
  const { data: banners } = useBanners();
  const { data: settings } = useSiteSettings();

  const heroBanners = banners ?? [];
  const banner = heroBanners[activeBanner];

  const handleBannerCta = () => {
    if (!banner?.ctaLink) return;
    if (/^https?:\/\//.test(banner.ctaLink)) {
      window.open(banner.ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(banner.ctaLink);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero banner carousel */}
      {banner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <section
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[300px] sm:min-h-[440px] flex items-center px-6 sm:px-16"
            style={{ backgroundColor: banner.bgColor ?? 'var(--color-accent-mint)' }}
          >
            <div
              className="hidden sm:block absolute -right-16 -top-24 w-[420px] h-[420px] rounded-full opacity-40"
              style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
              aria-hidden
            />
            <div className="relative z-10 max-w-[75%] sm:max-w-md py-8 sm:py-10">
              {banner.subtitle && (
                <p className="text-brand-700 font-semibold text-sm uppercase tracking-wide">
                  {banner.subtitle}
                </p>
              )}
              <h1 className="mt-3 text-2xl sm:text-5xl font-bold text-brand-900 leading-[1.1]">
                {banner.title}
              </h1>
              {banner.badgeText && (
                <p className="mt-4 text-sm sm:text-base text-brand-800/80 max-w-sm">
                  {banner.badgeText}
                </p>
              )}
              {banner.ctaLink && (
                <Button
                  className="mt-6 min-h-11 rounded-full px-7 bg-brand-600 hover:bg-brand-700 text-white"
                  onClick={handleBannerCta}
                >
                  {t('home.shopNow')}
                </Button>
              )}
            </div>
            {banner.imageUrl && (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute -right-8 bottom-0 w-[52%] sm:right-10 sm:top-1/2 sm:w-auto sm:max-h-[85%] sm:-translate-y-1/2 object-contain opacity-50 sm:opacity-100 drop-shadow-xl"
              />
            )}
            {heroBanners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveBanner((i) => (i - 1 + heroBanners.length) % heroBanners.length)
                  }
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-brand-900 flex items-center justify-center"
                  aria-label={t('home.prevBanner')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveBanner((i) => (i + 1) % heroBanners.length)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-brand-900 flex items-center justify-center"
                  aria-label={t('home.nextBanner')}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {heroBanners.map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => setActiveBanner(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeBanner ? 'w-6 bg-brand-700' : 'w-1.5 bg-brand-700/40'
                      }`}
                      aria-label={t('home.viewBanner', { n: i + 1 })}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Admin-curated homepage product sections */}
      {sections.map((section) => (
        <DealsSection
          key={section.id}
          title={section.title}
          deals={section.items
            .map(toSectionDeal)
            .filter((deal): deal is FeaturedDeal => deal !== null)}
          layout={section.displayStyle}
        />
      ))}

      {/* Trust badges */}
      <TrustBadgeStrip badges={settings?.trustBadges ?? []} />

      {/* FAQ */}
      <FaqAccordion />
    </div>
  );
};
