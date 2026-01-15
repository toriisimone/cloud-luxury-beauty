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

const FALLBACK_BODY_PRODUCT = {
  slug: 'necessaire-the-body-serum-with-hyaluronic-acid-niacinamide-and-ceramide',
  name: 'Nécessaire - The Body Serum - With Hyaluronic Acid, Niacinamide + Ceramide',
  description: 'The Body Serum with Hyaluronic Acid, Niacinamide, and Ceramide',
  price: 52.0,
  images: ['https://via.placeholder.com/800x800.png?text=Necessaire+Body+Serum'],
  featured: true,
  stock: 999,
} as const;

async function ensureFallbackBodyProduct(): Promise<void> {
  const bodyCategory = await prisma.category.findUnique({
    where: { slug: 'body' },
    select: { id: true },
  });
  if (!bodyCategory) return;

  await prisma.product.upsert({
    where: { slug: FALLBACK_BODY_PRODUCT.slug },
    update: {
      name: FALLBACK_BODY_PRODUCT.name,
      description: FALLBACK_BODY_PRODUCT.description,
      price: FALLBACK_BODY_PRODUCT.price,
      images: [...FALLBACK_BODY_PRODUCT.images],
      featured: FALLBACK_BODY_PRODUCT.featured,
      stock: FALLBACK_BODY_PRODUCT.stock,
      categoryId: bodyCategory.id,
    },
    create: {
      name: FALLBACK_BODY_PRODUCT.name,
      slug: FALLBACK_BODY_PRODUCT.slug,
      description: FALLBACK_BODY_PRODUCT.description,
      price: FALLBACK_BODY_PRODUCT.price,
      images: [...FALLBACK_BODY_PRODUCT.images],
      featured: FALLBACK_BODY_PRODUCT.featured,
      stock: FALLBACK_BODY_PRODUCT.stock,
      categoryId: bodyCategory.id,
    },
  });

  logger.info(`[AUTO SEED] Ensured fallback Body product: ${FALLBACK_BODY_PRODUCT.name}`);
}

export async function autoSeedIfEmpty(): Promise<void> {
  try {
    logger.info('[AUTO SEED] Checking if database needs core seeding...');

    // Ensure core categories exist; seed from CSV if any are missing.
    let coreCategories = await prisma.category.findMany({
      where: { slug: { in: [...CORE_CATEGORY_SLUGS] } },
      select: { id: true, slug: true },
    });

    if (coreCategories.length !== CORE_CATEGORY_SLUGS.length) {
      logger.info('[AUTO SEED] Core categories missing. Seeding from products.csv...');
      const result = await seedCoreCategoriesAndProductsFromCsv();
      logger.info(`[AUTO SEED] Seed completed. Categories ensured=${result.seededCategories}, products upserted=${result.seededProducts}`);
      coreCategories = await prisma.category.findMany({
        where: { slug: { in: [...CORE_CATEGORY_SLUGS] } },
        select: { id: true, slug: true },
      });
    }

    // If any core category has 0 products, attempt CSV seed to fill gaps.
    const counts = await Promise.all(
      coreCategories.map(async (c) => ({
        slug: c.slug,
        count: await prisma.product.count({ where: { categoryId: c.id } }),
      }))
    );
    const emptySlugs = counts.filter((c) => c.count === 0).map((c) => c.slug);
    if (emptySlugs.length > 0) {
      logger.warn(`[AUTO SEED] Core categories with 0 products: ${emptySlugs.join(', ')}. Seeding from products.csv...`);
      const result = await seedCoreCategoriesAndProductsFromCsv();
      logger.info(`[AUTO SEED] Seed completed. Categories ensured=${result.seededCategories}, products upserted=${result.seededProducts}`);
    } else {
      logger.info('[AUTO SEED] Core categories already have products. Skipping CSV seed.');
    }

    // Always ensure Body has at least 1 product for the homepage carousel.
    await ensureFallbackBodyProduct();
  } catch (error: any) {
    logger.error('[AUTO SEED] Auto-seeding failed:', error);
    logger.warn('[AUTO SEED] Server will continue without seeded data. You may need to seed manually.');
  }
}
