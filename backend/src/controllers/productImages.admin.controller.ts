import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import { auditNonShopifyImages, bulkUpdateProductImagesBySlug } from '../services/productImages.service';

function isShopifyCdnUrl(url: string): boolean {
  return (
    url.startsWith('https://cdn.shopify.com/s/files/') ||
    url.startsWith('https://cdn.shopifycdn.net/s/files/')
  );
}

export const bulkUpdateProductImages = async (req: AuthRequest, res: Response) => {
  try {
    const updates = (req.body?.updates || []) as Array<{ slug: string; images: string[] }>;

    // Enforce Shopify CDN URLs only
    const invalid: Array<{ slug: string; url: string }> = [];
    for (const u of updates) {
      for (const url of u.images || []) {
        if (!isShopifyCdnUrl(url)) invalid.push({ slug: u.slug, url });
      }
    }
    if (invalid.length > 0) {
      return res.status(400).json({
        error: 'Only Shopify CDN URLs are allowed for product images.',
        invalid,
        examples: ['https://cdn.shopify.com/s/files/...', 'https://cdn.shopifycdn.net/s/files/...'],
      });
    }

    const result = await bulkUpdateProductImagesBySlug(
      updates.map((u) => ({ slug: u.slug, images: u.images || [] }))
    );

    res.json({
      updatedCount: result.updatedCount,
      results: result.results,
    });
  } catch (error: any) {
    logger.error('[ADMIN] Bulk update product images error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const auditProductImages = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 200);
    const report = await auditNonShopifyImages(limit);
    res.json(report);
  } catch (error: any) {
    logger.error('[ADMIN] Audit product images error:', error);
    res.status(500).json({ error: error.message });
  }
};

