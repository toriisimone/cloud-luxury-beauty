import prisma from '../config/database';
import { logger } from '../config/logger';
import { seedRealSkincareProducts } from './seedRealSkincareProducts';

/**
 * Auto-seed skincare products if the Skincare category has no products
 * Returns true if products were seeded, false otherwise
 */
export async function autoSeedSkincareIfEmpty(): Promise<boolean> {
  try {
    logger.info('[AUTO SEED SKINCARE] ========== AUTO SEED FUNCTION CALLED ==========');
    logger.info('[AUTO SEED SKINCARE] Function called at:', new Date().toISOString());
    logger.info('[AUTO SEED SKINCARE] Checking if Skincare category needs products...');

    // Find Skincare category (case-insensitive)
    logger.info('[AUTO SEED SKINCARE] Searching for Skincare category in database...');
    const skincareCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: 'Skincare',
          mode: 'insensitive',
        },
      },
    });

    if (!skincareCategory) {
      logger.warn('[AUTO SEED SKINCARE] ========== CATEGORY NOT FOUND ==========');
      logger.warn('[AUTO SEED SKINCARE] Skincare category does not exist in database!');
      logger.warn('[AUTO SEED SKINCARE] Creating Skincare category...');
      
      // Create Skincare category if it doesn't exist
      const newCategory = await prisma.category.create({
        data: {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Skincare products for healthy, glowing skin',
        },
      });
      logger.info(`[AUTO SEED SKINCARE] ✅✅✅ CATEGORY CREATED ✅✅✅`);
      logger.info(`[AUTO SEED SKINCARE] Category ID: ${newCategory.id}`);
      logger.info(`[AUTO SEED SKINCARE] Category name: ${newCategory.name}`);
      logger.info(`[AUTO SEED SKINCARE] Category slug: ${newCategory.slug}`);
      logger.info(`[AUTO SEED SKINCARE] ==========================================`);
      
      // Now seed products for this category
      logger.info(`[AUTO SEED SKINCARE] Now seeding 20 products for this category...`);
      const seeded = await seedSkincareProducts(newCategory.id);
      logger.info(`[AUTO SEED SKINCARE] Seeding result: ${seeded ? 'SUCCESS' : 'FAILED'}`);
      return seeded;
    }

    logger.info(`[AUTO SEED SKINCARE] ✅ Skincare category found:`, {
      id: skincareCategory.id,
      name: skincareCategory.name,
      slug: skincareCategory.slug,
    });

    // Check if category has products
    logger.info(`[AUTO SEED SKINCARE] Checking product count for Skincare category...`);
    const productCount = await prisma.product.count({
      where: {
        categoryId: skincareCategory.id,
      },
    });

    logger.info(`[AUTO SEED SKINCARE] Current product count: ${productCount}`);

    if (productCount === 0) {
      logger.warn('[AUTO SEED SKINCARE] ========== NO PRODUCTS FOUND ==========');
      logger.warn('[AUTO SEED SKINCARE] Skincare category exists but has 0 products!');
      logger.warn('[AUTO SEED SKINCARE] Seeding 82 REAL Amazon skincare products...');
      
      // Try to seed real products first
      const realProductsSeeded = await seedRealSkincareProducts();
      if (realProductsSeeded) {
        logger.info(`[AUTO SEED SKINCARE] ✅ Real products seeded successfully`);
        logger.info(`[AUTO SEED SKINCARE] ==========================================`);
        return true;
      }
      
      // Fallback to sample products if real products fail
      logger.warn('[AUTO SEED SKINCARE] Real products seeding failed, falling back to sample products...');
      const seeded = await seedSkincareProducts(skincareCategory.id);
      logger.info(`[AUTO SEED SKINCARE] Seeding result: ${seeded ? 'SUCCESS' : 'FAILED'}`);
      logger.info(`[AUTO SEED SKINCARE] ==========================================`);
      return seeded;
    }

    logger.info('[AUTO SEED SKINCARE] ✅ Skincare category already has products, skipping seed');
    logger.info('[AUTO SEED SKINCARE] ==========================================');
    return false;
  } catch (error: any) {
    logger.error('[AUTO SEED SKINCARE] ========== ERROR ==========');
    logger.error('[AUTO SEED SKINCARE] Error checking/seeding skincare products:', error);
    logger.error('[AUTO SEED SKINCARE] Error message:', error.message);
    logger.error('[AUTO SEED SKINCARE] Error stack:', error.stack);
    logger.error('[AUTO SEED SKINCARE] ===========================');
    return false;
  }
}

/**
 * Seed skincare products
 */
async function seedSkincareProducts(categoryId: string): Promise<boolean> {
  try {
    logger.info('[SEED SKINCARE] ========== SEEDING PRODUCTS ==========');
    logger.info(`[SEED SKINCARE] Category ID: ${categoryId}`);
    logger.info(`[SEED SKINCARE] Starting to seed 20 skincare products...`);
    
    const skincareProducts = [
      {
        name: 'Hydrating Face Serum',
        description: 'Intensive hydrating serum with hyaluronic acid for plump, dewy skin',
        price: 28.00,
        stock: 50,
        categoryId,
        featured: true,
        images: ['/images/products/hydrating-serum.jpg'],
      },
      {
        name: 'Vitamin C Brightening Cream',
        description: 'Brightening cream with Vitamin C to even skin tone and reduce dark spots',
        price: 32.00,
        stock: 45,
        categoryId,
        featured: true,
        images: ['/images/products/vitamin-c-cream.jpg'],
      },
      {
        name: 'Gentle Cleansing Foam',
        description: 'Gentle foaming cleanser that removes impurities without stripping skin',
        price: 18.00,
        stock: 60,
        categoryId,
        featured: false,
        images: ['/images/products/cleansing-foam.jpg'],
      },
      {
        name: 'Retinol Night Treatment',
        description: 'Anti-aging night treatment with retinol to reduce fine lines and wrinkles',
        price: 45.00,
        stock: 35,
        categoryId,
        featured: true,
        images: ['/images/products/retinol-treatment.jpg'],
      },
      {
        name: 'SPF 50 Sunscreen',
        description: 'Broad spectrum sunscreen with SPF 50 for daily sun protection',
        price: 24.00,
        stock: 55,
        categoryId,
        featured: false,
        images: ['/images/products/sunscreen.jpg'],
      },
      {
        name: 'Niacinamide Pore Minimizer',
        description: 'Pore-minimizing serum with niacinamide to refine skin texture',
        price: 26.00,
        stock: 48,
        categoryId,
        featured: false,
        images: ['/images/products/niacinamide-serum.jpg'],
      },
      {
        name: 'Hyaluronic Acid Moisturizer',
        description: 'Lightweight moisturizer with hyaluronic acid for all-day hydration',
        price: 30.00,
        stock: 52,
        categoryId,
        featured: true,
        images: ['/images/products/moisturizer.jpg'],
      },
      {
        name: 'AHA Exfoliating Toner',
        description: 'Gentle exfoliating toner with AHA to reveal brighter, smoother skin',
        price: 22.00,
        stock: 40,
        categoryId,
        featured: false,
        images: ['/images/products/toner.jpg'],
      },
      {
        name: 'Eye Cream with Peptides',
        description: 'Targeted eye cream with peptides to reduce puffiness and dark circles',
        price: 35.00,
        stock: 38,
        categoryId,
        featured: true,
        images: ['/images/products/eye-cream.jpg'],
      },
      {
        name: 'Clay Detox Mask',
        description: 'Deep cleansing clay mask to draw out impurities and minimize pores',
        price: 20.00,
        stock: 42,
        categoryId,
        featured: false,
        images: ['/images/products/clay-mask.jpg'],
      },
      {
        name: 'Ceramide Repair Cream',
        description: 'Barrier repair cream with ceramides to restore and protect skin',
        price: 38.00,
        stock: 33,
        categoryId,
        featured: false,
        images: ['/images/products/ceramide-cream.jpg'],
      },
      {
        name: 'Peptide Anti-Aging Serum',
        description: 'Advanced anti-aging serum with peptides to firm and plump skin',
        price: 42.00,
        stock: 30,
        categoryId,
        featured: true,
        images: ['/images/products/peptide-serum.jpg'],
      },
      {
        name: 'Glycolic Acid Face Wash',
        description: 'Exfoliating face wash with glycolic acid for smoother, brighter skin',
        price: 19.00,
        stock: 50,
        categoryId,
        featured: false,
        images: ['/images/products/glycolic-wash.jpg'],
      },
      {
        name: 'Collagen Boosting Serum',
        description: 'Collagen-boosting serum to improve skin elasticity and firmness',
        price: 40.00,
        stock: 36,
        categoryId,
        featured: true,
        images: ['/images/products/collagen-serum.jpg'],
      },
      {
        name: 'Soothing Aloe Gel',
        description: 'Calming aloe vera gel to soothe irritated and sensitive skin',
        price: 16.00,
        stock: 58,
        categoryId,
        featured: false,
        images: ['/images/products/aloe-gel.jpg'],
      },
      {
        name: 'Brightening Essence',
        description: 'Lightweight essence with brightening ingredients for radiant skin',
        price: 29.00,
        stock: 44,
        categoryId,
        featured: false,
        images: ['/images/products/essence.jpg'],
      },
      {
        name: 'Overnight Repair Mask',
        description: 'Intensive overnight mask to repair and rejuvenate skin while you sleep',
        price: 36.00,
        stock: 32,
        categoryId,
        featured: true,
        images: ['/images/products/overnight-mask.jpg'],
      },
      {
        name: 'Salicylic Acid Spot Treatment',
        description: 'Targeted spot treatment with salicylic acid for blemish-prone skin',
        price: 17.00,
        stock: 56,
        categoryId,
        featured: false,
        images: ['/images/products/spot-treatment.jpg'],
      },
      {
        name: 'Antioxidant Day Cream',
        description: 'Protective day cream with antioxidants to shield skin from environmental damage',
        price: 34.00,
        stock: 41,
        categoryId,
        featured: false,
        images: ['/images/products/day-cream.jpg'],
      },
      {
        name: 'Multi-Peptide Complex',
        description: 'Advanced peptide complex to address multiple signs of aging',
        price: 48.00,
        stock: 28,
        categoryId,
        featured: true,
        images: ['/images/products/peptide-complex.jpg'],
      },
    ];

    logger.info(`[SEED SKINCARE] Total products to seed: ${skincareProducts.length}`);
    logger.info(`[SEED SKINCARE] Starting database insertions...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < skincareProducts.length; i++) {
      const product = skincareProducts[i];
      try {
        const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const created = await prisma.product.create({
          data: {
            ...product,
            slug,
          },
        });
        successCount++;
        if (i < 3 || i === skincareProducts.length - 1) {
          logger.info(`[SEED SKINCARE] Product ${i + 1}/${skincareProducts.length} created:`, {
            id: created.id,
            name: created.name,
            price: created.price,
          });
        }
      } catch (error: any) {
        failCount++;
        logger.error(`[SEED SKINCARE] Failed to create product ${i + 1}: ${product.name}`, error.message);
      }
    }

    logger.info(`[SEED SKINCARE] ========== SEEDING COMPLETE ==========`);
    logger.info(`[SEED SKINCARE] Successfully created: ${successCount} products`);
    logger.info(`[SEED SKINCARE] Failed: ${failCount} products`);
    
    if (successCount > 0) {
      logger.info(`[SEED SKINCARE] ✅✅✅ SUCCESS: ${successCount} skincare products seeded! ✅✅✅`);
    } else {
      logger.error(`[SEED SKINCARE] ❌❌❌ FAILED: No products were created! ❌❌❌`);
    }
    logger.info(`[SEED SKINCARE] =======================================`);
    
    return successCount > 0;
  } catch (error: any) {
    logger.error('[AUTO SEED SKINCARE] Error seeding skincare products:', error);
    return false;
  }
}
