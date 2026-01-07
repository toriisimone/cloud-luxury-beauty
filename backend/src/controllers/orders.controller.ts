import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as ordersService from '../services/orders.service';
import { logger } from '../config/logger';

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const orders = await ordersService.getUserOrders(userId);
    res.json(orders);
  } catch (error: any) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const order = await ordersService.getOrderById(id, userId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    logger.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const order = await ordersService.createOrder(userId, req.body);
    res.status(201).json(order);
  } catch (error: any) {
    logger.error('Create order error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await ordersService.updateOrderStatus(id, status);
    res.json(order);
  } catch (error: any) {
    logger.error('Update order status error:', error);
    res.status(400).json({ error: error.message });
  }
};
