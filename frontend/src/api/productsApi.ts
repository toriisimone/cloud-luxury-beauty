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
  
  console.log('[PRODUCTS API] ========== GET PRODUCTS CALLED ==========');
  console.log('[PRODUCTS API] Timestamp:', new Date().toISOString());
  console.log('[PRODUCTS API] Params received:', JSON.stringify(params, null, 2));
  console.log('[PRODUCTS API] Query params to send:', JSON.stringify(queryParams, null, 2));
  console.log('[PRODUCTS API] Axios baseURL:', axiosClient.defaults.baseURL);
  console.log('[PRODUCTS API] Full URL will be:', `${axiosClient.defaults.baseURL}/products`);
  console.log('[PRODUCTS API] With query params:', queryParams);
  
  try {
    const response = await axiosClient.get('/products', { params: queryParams });
    
    console.log('[PRODUCTS API] ========== RESPONSE RECEIVED ==========');
    console.log('[PRODUCTS API] Status:', response.status);
    console.log('[PRODUCTS API] Status text:', response.statusText);
    console.log('[PRODUCTS API] Response data keys:', Object.keys(response.data || {}));
    console.log('[PRODUCTS API] Product count:', response.data.products?.length || 0);
    console.log('[PRODUCTS API] Total:', response.data.total || 0);
    console.log('[PRODUCTS API] Page:', response.data.page || 0);
    console.log('[PRODUCTS API] Total pages:', response.data.totalPages || 0);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('[PRODUCTS API] ✅ SUCCESS: Products received!');
      console.log('[PRODUCTS API] First product:', {
        id: response.data.products[0].id,
        name: response.data.products[0].name,
        categoryId: response.data.products[0].categoryId,
      });
    } else {
      console.warn('[PRODUCTS API] ⚠️ WARNING: Empty products array received!');
    }
    console.log('[PRODUCTS API] ========================================');
    
    return response.data;
  } catch (error: any) {
    console.error('[PRODUCTS API] ========== ERROR ==========');
    console.error('[PRODUCTS API] Error fetching products:', error);
    console.error('[PRODUCTS API] Error message:', error.message);
    console.error('[PRODUCTS API] Error response:', error.response?.data);
    console.error('[PRODUCTS API] Error status:', error.response?.status);
    console.error('[PRODUCTS API] Request URL:', error.config?.url);
    console.error('[PRODUCTS API] Request baseURL:', error.config?.baseURL);
    console.error('[PRODUCTS API] Full request URL:', `${error.config?.baseURL}${error.config?.url}`);
    console.error('[PRODUCTS API] ===========================');
    throw error;
  }
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
