import { Request, Response } from 'express';
import * as amazonService from '../services/amazonApi.service';
import { logger } from '../config/logger';

/**
 * Get Amazon skincare products
 * Returns cached products (refreshed hourly)
 */
export const getAmazonProducts = async (req: Request, res: Response) => {
  try {
    logger.info('[AMAZON CONTROLLER] Request received for Amazon skincare products');
    const products = await amazonService.getSkincareProducts();
    logger.info(`[AMAZON CONTROLLER] Returning ${products.length} Amazon products`);
    
    res.json({
      products,
      count: products.length,
      source: 'amazon',
    });
  } catch (error: any) {
    logger.error('[AMAZON CONTROLLER] Get Amazon products error:', error);
    logger.error('[AMAZON CONTROLLER] Error stack:', error.stack);
    // Return empty array instead of error so frontend can fallback gracefully
    res.json({ 
      products: [],
      count: 0,
      source: 'amazon',
      error: error.message || 'Failed to fetch Amazon products',
    });
  }
};

/**
 * Manually refresh Amazon products cache
 */
export const refreshAmazonProducts = async (req: Request, res: Response) => {
  try {
    logger.info('[AMAZON CONTROLLER] Manual refresh requested');
    await amazonService.refreshProductCache();
    const products = await amazonService.getSkincareProducts();
    res.json({
      message: 'Products refreshed successfully',
      products,
      count: products.length,
    });
  } catch (error: any) {
    logger.error('[AMAZON CONTROLLER] Refresh Amazon products error:', error);
    res.status(500).json({ error: error.message || 'Failed to refresh products' });
  }
};

/**
 * Diagnostic endpoint to check Amazon API configuration
 */
export const checkAmazonConfig = async (req: Request, res: Response) => {
  const { config } = await import('../config/env');
  res.json({
    hasAccessKey: !!config.AMAZON_ACCESS_KEY,
    accessKeyLength: config.AMAZON_ACCESS_KEY.length,
    accessKeyPrefix: config.AMAZON_ACCESS_KEY.substring(0, 10),
    hasSecretKey: !!config.AMAZON_SECRET_KEY,
    secretKeyLength: config.AMAZON_SECRET_KEY.length,
    associateTag: config.AMAZON_ASSOCIATE_TAG,
    associateTagLength: config.AMAZON_ASSOCIATE_TAG.length,
    region: config.AMAZON_REGION,
    isConfigured: !!(config.AMAZON_ACCESS_KEY && config.AMAZON_SECRET_KEY && config.AMAZON_ASSOCIATE_TAG),
  });
};
