export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export interface CreateAddressInput {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  fullName?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  isDefault?: boolean;
}
