import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin, Phone } from 'lucide-react';
import { useSiteSettings } from '@/features/home';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 3C7.03 3 3 6.58 3 11c0 2.53 1.32 4.79 3.38 6.27-.15 1.06-.55 2.34-1.38 3.73 0 0 2.6-.5 4.84-2.19 .68.13 1.39.19 2.16.19 4.97 0 9-3.58 9-8s-4.03-8-9-8z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <text x="12" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="Inter, sans-serif">
      Zalo
    </text>
  </svg>
);

const DEFAULT_SITE_NAME = 'Rượu Vạn Xuân';
const DEFAULT_POPULAR_TITLE = 'Danh Mục Phổ Biến';
const DEFAULT_ABOUT_TITLE = 'Về Chúng Tôi';
const DEFAULT_SERVICES_TITLE = 'Dịch Vụ';
const DEFAULT_SERVICE_TITLE = 'Hỗ Trợ';
const DEFAULT_COPYRIGHT = `© ${new Date().getFullYear()} Rượu Vạn Xuân. All rights reserved.`;

export const Footer = () => {
  const { t } = useTranslation();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName ?? DEFAULT_SITE_NAME;
  const popularTitle = settings?.popularCategoriesTitle ?? DEFAULT_POPULAR_TITLE;
  const popularLinks = settings?.popularCategoriesLinks ?? [];
  const aboutTitle = settings?.footerAboutTitle ?? DEFAULT_ABOUT_TITLE;
  const aboutLinks = settings?.footerAboutLinks ?? [];
  const servicesTitle = settings?.footerServicesTitle ?? DEFAULT_SERVICES_TITLE;
  const servicesLinks = settings?.footerServicesLinks ?? [];
  const serviceTitle = settings?.customerServiceTitle ?? DEFAULT_SERVICE_TITLE;
  const serviceLinks = settings?.customerServiceLinks ?? [];
  const bottomLinks = settings?.footerBottomLinks ?? [];
  const copyrightText = settings?.copyrightText ?? DEFAULT_COPYRIGHT;

  const socialLinks = [
    settings?.facebookUrl && {
      key: 'facebook',
      label: 'Facebook',
      url: settings.facebookUrl,
      icon: FacebookIcon,
    },
    settings?.zaloUrl && {
      key: 'zalo',
      label: 'Zalo',
      url: settings.zaloUrl,
      icon: ZaloIcon,
    },
  ].filter((item): item is { key: string; label: string; url: string; icon: typeof FacebookIcon } =>
    Boolean(item),
  );

  const linkColumns = [
    { title: popularTitle, links: popularLinks },
    { title: aboutTitle, links: aboutLinks },
    { title: servicesTitle, links: servicesLinks },
    { title: serviceTitle, links: serviceLinks },
  ].filter((col) => col.links.length > 0);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <div className="grid gap-0 sm:gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5 font-bold text-lg text-brand-600 dark:text-white">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  VX
                </div>
              )}
              {siteName}
            </div>

            {settings?.footerDescription && (
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                {settings.footerDescription}
              </p>
            )}

            <div className="space-y-3 text-sm">
              {settings?.contactAddresses && settings.contactAddresses.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                  <div className="space-y-1">
                    <p className="text-slate-400">{t('footer.address')}</p>
                    {settings.contactAddresses.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {item.label ? `${item.label}: ${item.address}` : item.address}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-slate-400">{t('footer.hotline')}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {settings.contactPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {settings?.paymentMethodIcons && settings.paymentMethodIcons.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('footer.acceptedPayments')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {settings.paymentMethodIcons.map((icon) =>
                    icon.iconUrl ? (
                      <img
                        key={icon.name}
                        src={icon.iconUrl}
                        alt={icon.name}
                        className="h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white px-1.5"
                      />
                    ) : (
                      <span
                        key={icon.name}
                        className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                      >
                        {icon.name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {linkColumns.map((col) => (
            <FooterLinkColumn key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-end gap-3">
            {socialLinks.map(({ key, label, url, icon: Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-brand-600 hover:text-white transition-colors"
              >
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {bottomLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.url}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 text-center">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; url: string }[];
}) => (
  <>
    <details className="group border-t border-slate-200 sm:hidden dark:border-slate-800">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden dark:text-white">
        {title}
        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="space-y-2.5 pb-4 text-sm text-slate-500 dark:text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.url} className="hover:text-brand-600 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>

    <div className="hidden sm:block">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.url} className="hover:text-brand-600 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
);
