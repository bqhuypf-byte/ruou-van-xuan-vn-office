import { Link } from 'react-router';
import { Package, Phone } from 'lucide-react';
import { useSiteSettings } from '@/features/home';

const DEFAULT_SITE_NAME = 'MegaMart';
const DEFAULT_POPULAR_TITLE = 'Most Popular Categories';
const DEFAULT_SERVICE_TITLE = 'Customer Services';
const DEFAULT_COPYRIGHT = `© ${new Date().getFullYear()} All rights reserved.`;

export const Footer = () => {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName ?? DEFAULT_SITE_NAME;
  const popularTitle = settings?.popularCategoriesTitle ?? DEFAULT_POPULAR_TITLE;
  const popularLinks = settings?.popularCategoriesLinks ?? [];
  const serviceTitle = settings?.customerServiceTitle ?? DEFAULT_SERVICE_TITLE;
  const serviceLinks = settings?.customerServiceLinks ?? [];
  const copyrightText = settings?.copyrightText ?? DEFAULT_COPYRIGHT;

  return (
    <footer className="bg-[#008ECC] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2.5 font-bold text-lg text-white">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={siteName} className="h-9 object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
                <Package className="w-5 h-5" />
              </div>
            )}
            {siteName}
          </div>

          <div className="space-y-3 text-sm">
            {settings?.whatsappNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-white/70">Whats App</p>
                  <p className="font-semibold">{settings.whatsappNumber}</p>
                </div>
              </div>
            )}
            {settings?.contactPhone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-white/70">Call Us</p>
                  <p className="font-semibold">{settings.contactPhone}</p>
                </div>
              </div>
            )}
          </div>

          {(settings?.appStoreUrl || settings?.playStoreUrl) && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Download App</p>
              <div className="flex items-center gap-3">
                {settings.appStoreUrl && (
                  <a
                    href={settings.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/20 transition-colors"
                  >
                    App Store
                  </a>
                )}
                {settings.playStoreUrl && (
                  <a
                    href={settings.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/20 transition-colors"
                  >
                    Google Play
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{popularTitle}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            {popularLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.url} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{serviceTitle}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.url} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/70 text-center">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
};
