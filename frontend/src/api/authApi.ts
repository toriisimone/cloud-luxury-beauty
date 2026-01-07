import axiosClient from './axiosClient';
import { AuthResponse, User } from '../types/global';

export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/register', data);
  const result = response.data;
  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('refreshToken', result.refreshToken);
  return result;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/login', data);
  const result = response.data;
  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('refreshToken', result.refreshToken);
  return result;
};

export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getProfile = async (): Promise<User> => {
  const response = await axiosClient.get('/users/profile');
  return response.data;
};
