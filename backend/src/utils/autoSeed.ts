/**
 * Automatic database seeding on startup.
 *
 * IMPORTANT: We seed from `frontend/public/products.csv` into the 5 core categories:
 * skincare, makeup, hair, fragrance, body
 */
import prisma from '../config/database';
import { logger } from '../config/logger';
import { seedCoreCategoriesAndProductsFromCsv } from './seedFromCsv';

const CORE_CATEGORY_SLUGS = ['skincare', 'makeup', 'hair', 'fragrance', 'body'] as const;

export async function autoSeedIfEmpty(): Promise<void> {
  try {
    logger.info('[AUTO SEED] Checking if database needs core seeding...');

    // If we already have core categories AND products, do nothing.
    const coreCategories = await prisma.category.findMany({
      where: { slug: { in: [...CORE_CATEGORY_SLUGS] } },
      select: { id: true, slug: true },
    });

    const coreCategoryIds = coreCategories.map((c) => c.id);
    const coreProductCount = coreCategoryIds.length
      ? await prisma.product.count({ where: { categoryId: { in: coreCategoryIds } } })
      : 0;

    if (coreCategories.length === CORE_CATEGORY_SLUGS.length && coreProductCount > 0) {
      logger.info(`[AUTO SEED] Core categories present and have ${coreProductCount} products. Skipping seed.`);
      return;
    }

    logger.info('[AUTO SEED] Core data missing. Seeding from products.csv...');
    const result = await seedCoreCategoriesAndProductsFromCsv();
    logger.info(`[AUTO SEED] Seed completed. Categories ensured=${result.seededCategories}, products upserted=${result.seededProducts}`);
  } catch (error: any) {
    logger.error('[AUTO SEED] Auto-seeding failed:', error);
    logger.warn('[AUTO SEED] Server will continue without seeded data. You may need to seed manually.');
  }
}
