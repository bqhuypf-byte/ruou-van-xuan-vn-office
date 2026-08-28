import { useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

/**
 * Applies admin-configured browser tab title + favicon at runtime.
 * The static values in index.html stay as the SEO/initial-paint fallback;
 * once site settings load, this overrides them if the admin has set custom ones.
 */
export const SiteMetaSync = () => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (settings?.browserTitle) {
      document.title = settings.browserTitle;
    }
  }, [settings?.browserTitle]);

  useEffect(() => {
    if (!settings?.faviconUrl) return;
    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      document.head.appendChild(document.createElement('link'));
    link.rel = 'icon';
    link.href = settings.faviconUrl;
  }, [settings?.faviconUrl]);

  return null;
};
