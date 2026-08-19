import { axiosInstance } from '@/shared/lib/axios';
import type { Address, CreateAddressInput, UpdateAddressInput } from '../types/address.types';

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get<{ data: Address[] }>('/addresses');
    return response.data.data;
  },

  createAddress: async (input: CreateAddressInput): Promise<Address> => {
    const response = await axiosInstance.post<{ data: Address }>('/addresses', input);
    return response.data.data;
  },

  updateAddress: async (id: number, input: UpdateAddressInput): Promise<Address> => {
    const response = await axiosInstance.patch<{ data: Address }>(`/addresses/${id}`, input);
    return response.data.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: number): Promise<Address> => {
    const response = await axiosInstance.patch<{ data: Address }>(`/addresses/${id}/default`);
    return response.data.data;
  },
};
