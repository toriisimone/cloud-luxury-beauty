import axiosClient from './axiosClient';
import { Product } from '../types/global';

export interface GetProductsParams {
  categoryId?: string;
  category?: string; // Support category name
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getProducts = async (params?: GetProductsParams): Promise<ProductsResponse> => {
  // Build query params - include category name if provided
  const queryParams: any = { ...params };
  if (params?.category) {
    queryParams.category = params.category;
  }
  
  console.log('[PRODUCTS API] ========== GET PRODUCTS ==========');
  console.log('[PRODUCTS API] Params:', queryParams);
  console.log('[PRODUCTS API] Calling: /products with params:', queryParams);
  
  const response = await axiosClient.get('/products', { params: queryParams });
  
  console.log('[PRODUCTS API] Response received:', {
    productCount: response.data.products?.length || 0,
    total: response.data.total || 0,
    page: response.data.page || 0,
    totalPages: response.data.totalPages || 0,
  });
  console.log('[PRODUCTS API] ===================================');
  
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const response = await axiosClient.post('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const response = await axiosClient.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosClient.delete(`/products/${id}`);
};
