import { useQuery } from '@tanstack/react-query';
import { faqService } from '../services/faq.service';

export const FAQ_QUERY_KEY = ['faqs'] as const;
export const ADMIN_FAQ_QUERY_KEY = ['admin-faqs'] as const;

export const useFaqs = () =>
  useQuery({
    queryKey: FAQ_QUERY_KEY,
    queryFn: faqService.getActiveFaqs,
  });

export const useAdminFaqs = () =>
  useQuery({
    queryKey: ADMIN_FAQ_QUERY_KEY,
    queryFn: faqService.getAllFaqs,
  });
