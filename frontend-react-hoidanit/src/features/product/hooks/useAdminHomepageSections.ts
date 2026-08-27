import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { homepageSectionService } from '../services/homepage-section.service';
import type {
  AddSectionItemInput,
  CreateHomepageSectionInput,
  UpdateHomepageSectionInput,
  UpdateSectionItemInput,
} from '../types/homepage-section.types';

export const ADMIN_HOMEPAGE_SECTIONS_QUERY_KEY = ['admin-homepage-sections'] as const;

export const useAdminHomepageSections = () => {
  const query = useQuery({
    queryKey: ADMIN_HOMEPAGE_SECTIONS_QUERY_KEY,
    queryFn: homepageSectionService.getAdminSections,
  });

  return { ...query, sections: query.data ?? [] };
};

const useInvalidateSections = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_HOMEPAGE_SECTIONS_QUERY_KEY });
  };
};

export const useCreateHomepageSection = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: (input: CreateHomepageSectionInput) =>
      homepageSectionService.createSection(input),
    onSuccess: invalidate,
  });
};

export const useUpdateHomepageSection = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateHomepageSectionInput }) =>
      homepageSectionService.updateSection(id, input),
    onSuccess: invalidate,
  });
};

export const useDeleteHomepageSection = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: (id: number) => homepageSectionService.deleteSection(id),
    onSuccess: invalidate,
  });
};

export const useReorderHomepageSections = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: (ids: number[]) => homepageSectionService.reorderSections(ids),
    onSuccess: invalidate,
  });
};

export const useAddSectionItem = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: ({
      sectionId,
      input,
    }: {
      sectionId: number;
      input: AddSectionItemInput;
    }) => homepageSectionService.addItem(sectionId, input),
    onSuccess: invalidate,
  });
};

export const useUpdateSectionItem = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: ({
      sectionId,
      itemId,
      input,
    }: {
      sectionId: number;
      itemId: number;
      input: UpdateSectionItemInput;
    }) => homepageSectionService.updateItem(sectionId, itemId, input),
    onSuccess: invalidate,
  });
};

export const useRemoveSectionItem = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: ({ sectionId, itemId }: { sectionId: number; itemId: number }) =>
      homepageSectionService.removeItem(sectionId, itemId),
    onSuccess: invalidate,
  });
};

export const useReorderSectionItems = () => {
  const invalidate = useInvalidateSections();
  return useMutation({
    mutationFn: ({ sectionId, ids }: { sectionId: number; ids: number[] }) =>
      homepageSectionService.reorderItems(sectionId, ids),
    onSuccess: invalidate,
  });
};
