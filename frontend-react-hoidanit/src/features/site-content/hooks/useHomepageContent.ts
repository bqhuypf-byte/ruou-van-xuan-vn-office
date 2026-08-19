import { useQuery } from '@tanstack/react-query';
import { siteContentService } from '../services/site-content.service';

export const HOMEPAGE_CONTENT_QUERY_KEY = ['homepage-content'] as const;

export const useHomepageContent = () =>
  useQuery({
    queryKey: HOMEPAGE_CONTENT_QUERY_KEY,
    queryFn: siteContentService.getHomepageContent,
  });
