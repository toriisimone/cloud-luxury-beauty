import { Request, Response } from 'express';
import * as amazonService from '../services/amazonApi.service';
import { logger } from '../config/logger';

/**
 * Get Amazon skincare products
 * Returns cached products (refreshed hourly)
 */
export const getAmazonProducts = async (req: Request, res: Response) => {
  try {
    const products = await amazonService.getSkincareProducts();
    res.json({
      products,
      count: products.length,
      source: 'amazon',
    });
  } catch (error: any) {
    logger.error('Get Amazon products error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch Amazon products',
      products: [], // Return empty array on error
    });
  }
};

/**
 * Manually refresh Amazon products cache
 */
export const refreshAmazonProducts = async (req: Request, res: Response) => {
  try {
    await amazonService.refreshProductCache();
    const products = await amazonService.getSkincareProducts();
    res.json({
      message: 'Products refreshed successfully',
      products,
      count: products.length,
    });
  } catch (error: any) {
    logger.error('Refresh Amazon products error:', error);
    res.status(500).json({ error: error.message || 'Failed to refresh products' });
  }
};
