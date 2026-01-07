import axiosClient from './axiosClient';
import { Coupon } from '../types/global';

export const getCoupons = async (): Promise<Coupon[]> => {
  const response = await axiosClient.get('/coupons');
  return response.data;
};

export const getCouponByCode = async (code: string): Promise<Coupon> => {
  const response = await axiosClient.get(`/coupons/${code}`);
  return response.data;
};

export const createCoupon = async (data: Partial<Coupon>): Promise<Coupon> => {
  const response = await axiosClient.post('/coupons', data);
  return response.data;
};

export const updateCoupon = async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
  const response = await axiosClient.put(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await axiosClient.delete(`/coupons/${id}`);
};
