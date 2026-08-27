import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '../services/faq.service';
import { ADMIN_FAQ_QUERY_KEY, FAQ_QUERY_KEY } from './useFaqs';
import type { CreateFaqInput, UpdateFaqInput } from '../types/home.types';

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: FAQ_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ADMIN_FAQ_QUERY_KEY });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFaqInput) => faqService.createFaq(input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateFaqInput }) =>
      faqService.updateFaq(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => faqService.deleteFaq(id),
    onSuccess: () => invalidate(queryClient),
  });
};
