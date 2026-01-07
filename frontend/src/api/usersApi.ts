import axiosClient from './axiosClient';
import { User, Product } from '../types/global';

export const getProfile = async (): Promise<User> => {
  const response = await axiosClient.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await axiosClient.put('/users/profile', data);
  return response.data;
};

export const getWishlist = async (): Promise<Array<{ id: string; product: Product; createdAt: string }>> => {
  const response = await axiosClient.get('/users/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: string): Promise<void> => {
  await axiosClient.post('/users/wishlist', { productId });
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await axiosClient.delete(`/users/wishlist/${productId}`);
};
