import axiosClient from './axiosClient';
import { Category } from '../types/global';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosClient.get('/categories');
  return response.data;
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
