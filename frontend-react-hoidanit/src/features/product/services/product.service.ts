import { axiosInstance } from '@/shared/lib/axios';
import type { PaginatedResponse, PaginationMeta } from '@/shared/types/api.types';
import type {
  CreateProductInput,
  Product,
  ProductFilterParams,
  UpdateProductInput,
} from '../types/product.types';
import type { ProductVariant } from '../types/variant.types';
import type { ProductImage } from '../types/image.types';

export interface ProductListResult {
  products: Product[];
  meta: PaginationMeta;
}

export interface ProductDetail extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
}

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<ProductListResult> => {
    const response = await axiosInstance.get<PaginatedResponse<Product>>('/products', {
      params: {
        search: params?.search,
        categoryId: params?.categoryId,
        isActive: params?.isActive,
        isFeaturedDeal: params?.isFeaturedDeal,
        page: params?.page,
        limit: params?.limit,
      },
    });
    return { products: response.data.data, meta: response.data.meta };
  },

  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const response = await axiosInstance.get<{ data: ProductDetail }>(
      `/products/${slug}`,
    );
    return response.data.data;
  },

  createProduct: async (input: CreateProductInput): Promise<Product> => {
    const response = await axiosInstance.post<{ data: Product }>(
      '/admin/products',
      input,
    );
    return response.data.data;
  },

  updateProduct: async (id: number, input: UpdateProductInput): Promise<Product> => {
    const response = await axiosInstance.patch<{ data: Product }>(
      `/admin/products/${id}`,
      input,
    );
    return response.data.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/products/${id}`);
  },
};
