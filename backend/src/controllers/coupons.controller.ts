import { Request, Response } from 'express';
import * as couponsService from '../services/coupons.service';
import { logger } from '../config/logger';

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponsService.getActiveCoupons();
    res.json(coupons);
  } catch (error: any) {
    logger.error('Get coupons error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCouponByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const coupon = await couponsService.getCouponByCode(code.toUpperCase());

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error: any) {
    logger.error('Get coupon error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await couponsService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error: any) {
    logger.error('Create coupon error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await couponsService.updateCoupon(id, req.body);
    res.json(coupon);
  } catch (error: any) {
    logger.error('Update coupon error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await couponsService.deleteCoupon(id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    logger.error('Delete coupon error:', error);
    res.status(400).json({ error: error.message });
  }
};
