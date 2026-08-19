import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/address.service';

export const ADDRESS_QUERY_KEY = ['addresses'] as const;

export const useAddresses = () => {
  const query = useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: addressService.getAddresses,
  });

  return { ...query, addresses: query.data ?? [] };
};
