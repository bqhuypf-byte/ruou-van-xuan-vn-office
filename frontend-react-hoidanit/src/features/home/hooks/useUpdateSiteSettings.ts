import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../services/siteSettings.service';
import { SITE_SETTINGS_QUERY_KEY } from './useSiteSettings';
import type { UpdateSiteSettingsInput } from '../types/home.types';

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSiteSettingsInput) => siteSettingsService.updateSiteSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};
