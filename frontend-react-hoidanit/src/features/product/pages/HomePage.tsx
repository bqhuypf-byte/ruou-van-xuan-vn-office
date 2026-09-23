import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useBanners } from '@/features/home/hooks/useBanners';
import { useSiteSettings } from '@/features/home/hooks/useSiteSettings';
import { TrustBadgeStrip } from '@/features/home/components/TrustBadgeStrip';
import { FaqAccordion } from '@/features/home/components/FaqAccordion';
import { DealsSection } from '../components/DealsSection';
import { useHomepageSections, toSectionDeal } from '../hooks/useHomepageSections';
import type { FeaturedDeal } from '../hooks/useFeaturedDeals';

const hasDarkBackground = (value?: string | null) => {
  if (!value) return false;
  const match = value.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return false;
  const hex = match[1].length === 3
    ? match[1].split('').map((character) => character + character).join('')
    : match[1];
  const [red, green, blue] = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  return (red * 299 + green * 587 + blue * 114) / 1000 < 150;
};

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);

  const { sections } = useHomepageSections();
  const { data: banners } = useBanners();
  const { data: settings } = useSiteSettings();

  const heroBanners = banners ?? [];
  const banner = heroBanners[activeBanner];
  const isFullImageBanner = banner?.bgColor === 'transparent';
  const useLightText = hasDarkBackground(banner?.bgColor);

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
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[300px] sm:min-h-[440px] flex items-center ${isFullImageBanner ? '' : 'px-6 sm:px-16'}`}
            style={{ backgroundColor: banner.bgColor ?? 'var(--color-accent-mint)' }}
          >
            {!isFullImageBanner && (
              <div
                className="hidden sm:block absolute -right-16 -top-24 w-[420px] h-[420px] rounded-full opacity-40"
                style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
                aria-hidden
              />
            )}
            {!isFullImageBanner && <div className="relative z-10 max-w-[75%] sm:max-w-md py-8 sm:py-10">
              {banner.subtitle && (
                <p className={`font-semibold text-sm uppercase tracking-wide ${useLightText ? 'text-amber-200' : 'text-brand-700'}`}>
                  {banner.subtitle}
                </p>
              )}
              <h1 className={`mt-3 text-2xl sm:text-5xl font-bold leading-[1.1] ${useLightText ? 'text-white' : 'text-brand-900'}`}>
                {banner.title}
              </h1>
              {banner.badgeText && (
                <p className={`mt-4 max-w-sm text-sm sm:text-base ${useLightText ? 'text-white/85' : 'text-brand-800/80'}`}>
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
            </div>}
            {banner.imageUrl && (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className={isFullImageBanner
                  ? 'absolute inset-0 h-full w-full object-cover'
                  : 'absolute -right-8 bottom-0 w-[52%] object-contain opacity-50 drop-shadow-xl sm:right-10 sm:top-1/2 sm:w-auto sm:max-h-[85%] sm:-translate-y-1/2 sm:opacity-100'}
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
                        i === activeBanner
                          ? `w-6 ${useLightText ? 'bg-white' : 'bg-brand-700'}`
                          : `w-1.5 ${useLightText ? 'bg-white/45' : 'bg-brand-700/40'}`
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
