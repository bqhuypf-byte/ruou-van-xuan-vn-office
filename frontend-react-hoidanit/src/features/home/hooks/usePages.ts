import { useQuery } from '@tanstack/react-query';
import { pageService } from '../services/page.service';

export const PAGE_QUERY_KEY = (slug: string) => ['page', slug] as const;
export const ADMIN_PAGE_QUERY_KEY = ['admin-pages'] as const;

export const usePage = (slug: string | undefined) =>
  useQuery({
    queryKey: PAGE_QUERY_KEY(slug ?? ''),
    queryFn: () => pageService.getBySlug(slug!),
    enabled: Boolean(slug),
    retry: false,
  });

export const useAdminPages = () =>
  useQuery({
    queryKey: ADMIN_PAGE_QUERY_KEY,
    queryFn: pageService.getAllPages,
  });
