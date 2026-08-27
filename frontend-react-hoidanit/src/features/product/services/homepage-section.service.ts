import { axiosInstance } from '@/shared/lib/axios';
import type {
  AddSectionItemInput,
  CreateHomepageSectionInput,
  HomepageSection,
  HomepageSectionItem,
  UpdateHomepageSectionInput,
  UpdateSectionItemInput,
} from '../types/homepage-section.types';

export const homepageSectionService = {
  getPublicSections: async (): Promise<HomepageSection[]> => {
    const response = await axiosInstance.get<{ data: HomepageSection[] }>(
      '/homepage-sections',
    );
    return response.data.data;
  },

  getAdminSections: async (): Promise<HomepageSection[]> => {
    const response = await axiosInstance.get<{ data: HomepageSection[] }>(
      '/admin/homepage-sections',
    );
    return response.data.data;
  },

  createSection: async (input: CreateHomepageSectionInput): Promise<HomepageSection> => {
    const response = await axiosInstance.post<{ data: HomepageSection }>(
      '/admin/homepage-sections',
      input,
    );
    return response.data.data;
  },

  updateSection: async (
    id: number,
    input: UpdateHomepageSectionInput,
  ): Promise<HomepageSection> => {
    const response = await axiosInstance.patch<{ data: HomepageSection }>(
      `/admin/homepage-sections/${id}`,
      input,
    );
    return response.data.data;
  },

  deleteSection: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/homepage-sections/${id}`);
  },

  reorderSections: async (ids: number[]): Promise<void> => {
    await axiosInstance.patch('/admin/homepage-sections/reorder', { ids });
  },

  addItem: async (
    sectionId: number,
    input: AddSectionItemInput,
  ): Promise<HomepageSectionItem> => {
    const response = await axiosInstance.post<{ data: HomepageSectionItem }>(
      `/admin/homepage-sections/${sectionId}/items`,
      input,
    );
    return response.data.data;
  },

  updateItem: async (
    sectionId: number,
    itemId: number,
    input: UpdateSectionItemInput,
  ): Promise<HomepageSectionItem> => {
    const response = await axiosInstance.patch<{ data: HomepageSectionItem }>(
      `/admin/homepage-sections/${sectionId}/items/${itemId}`,
      input,
    );
    return response.data.data;
  },

  removeItem: async (sectionId: number, itemId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/homepage-sections/${sectionId}/items/${itemId}`);
  },

  reorderItems: async (sectionId: number, ids: number[]): Promise<void> => {
    await axiosInstance.patch(`/admin/homepage-sections/${sectionId}/items/reorder`, {
      ids,
    });
  },
};
