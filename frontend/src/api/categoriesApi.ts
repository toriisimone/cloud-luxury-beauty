import axiosClient from './axiosClient';
import { Category } from '../types/global';

export const getCategories = async (): Promise<Category[]> => {
  console.log('[CATEGORIES API] ========== GET CATEGORIES CALLED ==========');
  console.log('[CATEGORIES API] Axios baseURL:', axiosClient.defaults.baseURL);
  console.log('[CATEGORIES API] Full URL will be:', `${axiosClient.defaults.baseURL}/categories`);
  
  try {
    const response = await axiosClient.get('/categories');
    console.log('[CATEGORIES API] ✅ SUCCESS: Categories received');
    console.log('[CATEGORIES API] Category count:', response.data?.length || 0);
    console.log('[CATEGORIES API] ========================================');
    return response.data;
  } catch (error: any) {
    console.error('[CATEGORIES API] ========== ERROR ==========');
    console.error('[CATEGORIES API] Error fetching categories:', error);
    console.error('[CATEGORIES API] Request baseURL:', error.config?.baseURL);
    console.error('[CATEGORIES API] Full request URL:', `${error.config?.baseURL}${error.config?.url}`);
    console.error('[CATEGORIES API] ===========================');
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosClient.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const response = await axiosClient.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const response = await axiosClient.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosClient.delete(`/categories/${id}`);
};
