import { Request, Response } from 'express';
// AMAZON API DISABLED: All Amazon API calls are disabled
// import * as amazonService from '../services/amazonApi.service';
import { logger } from '../config/logger';

/**
 * Get Amazon skincare products
 * DISABLED: Amazon API is disabled - always returns empty array
 * Use /api/products?category=Skincare to get database products instead
 */
export const getAmazonProducts = async (req: Request, res: Response) => {
  logger.info('[AMAZON CONTROLLER] ⚠️ Amazon API is DISABLED - returning empty array');
  logger.info('[AMAZON CONTROLLER] Use /api/products?category=Skincare to get database products');
  
  res.json({
    products: [],
    count: 0,
    source: 'amazon',
    message: 'Amazon API is disabled. Use /api/products?category=Skincare to get database products.',
  });
};

/**
 * Manually refresh Amazon products cache
 * DISABLED: Amazon API is disabled
 */
export const refreshAmazonProducts = async (req: Request, res: Response) => {
  logger.info('[AMAZON CONTROLLER] ⚠️ Amazon API is DISABLED - refresh endpoint disabled');
  
  res.json({
    message: 'Amazon API is disabled. Products are stored in the database.',
    products: [],
    count: 0,
    source: 'amazon',
  });
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
