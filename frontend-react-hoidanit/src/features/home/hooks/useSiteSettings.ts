import { useQuery } from '@tanstack/react-query';
import { siteSettingsService } from '../services/siteSettings.service';

export const SITE_SETTINGS_QUERY_KEY = ['site-settings'] as const;

export const useSiteSettings = () =>
  useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: siteSettingsService.getSiteSettings,
  });
