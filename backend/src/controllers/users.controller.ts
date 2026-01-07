import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as usersService from '../services/users.service';
import { logger } from '../config/logger';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await usersService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await usersService.updateUser(userId, req.body);
    res.json(user);
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const wishlist = await usersService.getWishlist(userId);
    res.json(wishlist);
  } catch (error: any) {
    logger.error('Get wishlist error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { productId } = req.body;
    const wishlistItem = await usersService.addToWishlist(userId, productId);
    res.status(201).json(wishlistItem);
  } catch (error: any) {
    logger.error('Add to wishlist error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { productId } = req.params;
    await usersService.removeFromWishlist(userId, productId);
    res.json({ message: 'Item removed from wishlist' });
  } catch (error: any) {
    logger.error('Remove from wishlist error:', error);
    res.status(400).json({ error: error.message });
  }
};
