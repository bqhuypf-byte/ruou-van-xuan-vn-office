import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siteContentService } from '../services/site-content.service';
import { HOMEPAGE_CONTENT_QUERY_KEY } from './useHomepageContent';
import type { UpdateHomepageContentInput } from '../types/site-content.types';

export const useUpdateHomepageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateHomepageContentInput) =>
      siteContentService.updateHomepageContent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOMEPAGE_CONTENT_QUERY_KEY });
    },
  });
};
