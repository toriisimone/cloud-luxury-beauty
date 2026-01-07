import axiosClient from './axiosClient';
import { Order } from '../types/global';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  couponCode?: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await axiosClient.get('/orders');
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await axiosClient.post('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const response = await axiosClient.put(`/orders/${id}/status`, { status });
  return response.data;
};
