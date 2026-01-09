import { Request, Response } from 'express';
import * as productsService from '../services/products.service';
import { logger } from '../config/logger';
// AMAZON API DISABLED: Always use database products
// import * as amazonService from '../services/amazonApi.service';

// Startup log to confirm controller is loaded
logger.info('[PRODUCTS CONTROLLER] ✅ Product controller module loaded and ready');

export const getProducts = async (req: Request, res: Response) => {
  // CRITICAL: Log immediately when function is called
  logger.info('[PRODUCTS CONTROLLER] ============================================');
  logger.info('[PRODUCTS CONTROLLER] ✅✅✅ getProducts() FUNCTION CALLED ✅✅✅');
  logger.info('[PRODUCTS CONTROLLER] This means the route is working!');
  logger.info('[PRODUCTS CONTROLLER] ============================================');
  console.log('[PRODUCTS CONTROLLER] ✅✅✅ getProducts() FUNCTION CALLED ✅✅✅');
  console.log('[PRODUCTS CONTROLLER] Request path:', req.path);
  console.log('[PRODUCTS CONTROLLER] Request originalUrl:', req.originalUrl);
  console.log('[PRODUCTS CONTROLLER] Request query:', req.query);
  
  try {
    const {
      categoryId,
      category, // Support category name as well
      search,
      minPrice,
      maxPrice,
      featured,
      page = '1',
      limit = '20',
    } = req.query;

    logger.info('[PRODUCTS CONTROLLER] ========== GET PRODUCTS REQUEST ==========');
    logger.info('[PRODUCTS CONTROLLER] Request received at:', new Date().toISOString());
    logger.info('[PRODUCTS CONTROLLER] Query params:', JSON.stringify({
      categoryId,
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      page,
      limit,
    }, null, 2));
    
    // AMAZON API DISABLED: Always use database products for Skincare category
    // The 82 real Amazon products are already stored in the database
    // No API calls will be made - only database queries

    // If category name is provided, find the category ID
    let finalCategoryId = categoryId as string | undefined;
    if (category && !categoryId) {
      logger.info(`[PRODUCTS CONTROLLER] ========== CATEGORY NAME LOOKUP ==========`);
      logger.info(`[PRODUCTS CONTROLLER] Category name provided: "${category}"`);
      logger.info(`[PRODUCTS CONTROLLER] Looking up category ID...`);
      
      const { getCategoryByName } = await import('../services/categories.service');
      let categoryObj = await getCategoryByName(category as string);
      
      logger.info(`[PRODUCTS CONTROLLER] Category lookup result: ${categoryObj ? 'FOUND' : 'NOT FOUND'}`);
      if (categoryObj) {
        logger.info(`[PRODUCTS CONTROLLER] Category details:`, {
          id: categoryObj.id,
          name: categoryObj.name,
          slug: categoryObj.slug,
        });
      }
      
      // If Skincare category doesn't exist, create it and seed products FIRST
      if (!categoryObj && (category as string).toLowerCase() === 'skincare') {
        logger.warn(`[PRODUCTS CONTROLLER] ========== SKINCARE CATEGORY MISSING ==========`);
        logger.warn(`[PRODUCTS CONTROLLER] Skincare category not found in database!`);
        logger.warn(`[PRODUCTS CONTROLLER] Creating Skincare category and seeding 20 products...`);
        
        const { autoSeedSkincareIfEmpty } = await import('../utils/autoSeedSkincare');
        logger.info(`[PRODUCTS CONTROLLER] Calling autoSeedSkincareIfEmpty()...`);
        
        const seeded = await autoSeedSkincareIfEmpty();
        
        if (seeded) {
          logger.info('[PRODUCTS CONTROLLER] ✅✅✅ SKINCARE CATEGORY CREATED AND PRODUCTS SEEDED ✅✅✅');
          logger.info('[PRODUCTS CONTROLLER] 20 skincare products have been added to the database');
          
          // Look up the category again after creation
          logger.info(`[PRODUCTS CONTROLLER] Looking up newly created Skincare category...`);
          categoryObj = await getCategoryByName('Skincare');
          
          if (categoryObj) {
            logger.info(`[PRODUCTS CONTROLLER] ✅ Found newly created category:`, {
              id: categoryObj.id,
              name: categoryObj.name,
            });
          } else {
            logger.error(`[PRODUCTS CONTROLLER] ❌ ERROR: Category was created but cannot be found!`);
          }
        } else {
          logger.error(`[PRODUCTS CONTROLLER] ❌ ERROR: autoSeedSkincareIfEmpty returned false - seeding failed!`);
        }
        logger.info(`[PRODUCTS CONTROLLER] ==========================================`);
      }
      
      if (categoryObj) {
        finalCategoryId = categoryObj.id;
        logger.info(`[PRODUCTS CONTROLLER] ✅ Using category ID: ${finalCategoryId} for category name: "${category}"`);
      } else {
        logger.warn(`[PRODUCTS CONTROLLER] ⚠️ Category "${category}" not found in database and could not be created`);
      }
      logger.info(`[PRODUCTS CONTROLLER] ==========================================`);
    }

    const result = await productsService.getProducts({
      categoryId: finalCategoryId,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    });

    logger.info('[PRODUCTS CONTROLLER] ========== PRODUCTS RESPONSE ==========');
    logger.info(`[PRODUCTS CONTROLLER] Products returned: ${result.products.length}`);
    logger.info(`[PRODUCTS CONTROLLER] Total: ${result.total}`);
    logger.info(`[PRODUCTS CONTROLLER] Page: ${result.page}/${result.totalPages}`);
    
    // If Skincare category and no products OR fewer than 82 products, seed all 82 products
    if (category && (category as string).toLowerCase() === 'skincare') {
      logger.info(`[PRODUCTS CONTROLLER] ========== SKINCARE CATEGORY CHECK ==========`);
      logger.info(`[PRODUCTS CONTROLLER] Products found: ${result.products.length}`);
      logger.info(`[PRODUCTS CONTROLLER] Total in category: ${result.total}`);
      
      // Verify category exists and get final ID
      if (!finalCategoryId) {
        const { getCategoryByName } = await import('../services/categories.service');
        const categoryObj = await getCategoryByName('Skincare');
        if (categoryObj) {
          finalCategoryId = categoryObj.id;
          logger.info(`[PRODUCTS CONTROLLER] ✅ Found Skincare category ID: ${finalCategoryId}`);
        }
      }
      
      // Check if we need to seed (0 products or fewer than 82)
      if (result.total < 82) {
        logger.warn(`[PRODUCTS CONTROLLER] ⚠️ Only ${result.total} skincare products found (expected 82)!`);
        logger.warn(`[PRODUCTS CONTROLLER] Attempting to seed all 82 products...`);
        
        // Seed all 82 products
        const { seedAll82SkincareProducts } = await import('../utils/seedSkincare82Products');
        logger.info(`[PRODUCTS CONTROLLER] Calling seedAll82SkincareProducts()...`);
        const seeded = await seedAll82SkincareProducts();
        
        if (seeded) {
          logger.info('[PRODUCTS CONTROLLER] ✅ All 82 skincare products seeded successfully!');
          logger.info('[PRODUCTS CONTROLLER] Fetching products again...');
          
          // Fetch again after seeding with higher limit to get all products
          const newResult = await productsService.getProducts({
            categoryId: finalCategoryId,
            search: search as string,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
            page: parseInt(page as string, 10),
            limit: 100, // Get all 82 products
          });
          
          logger.info(`[PRODUCTS CONTROLLER] ========== AFTER SEEDING ==========`);
          logger.info(`[PRODUCTS CONTROLLER] Products returned: ${newResult.products.length}`);
          logger.info(`[PRODUCTS CONTROLLER] Total in category: ${newResult.total}`);
          logger.info(`[PRODUCTS CONTROLLER] ✅ Returning ${newResult.products.length} skincare products`);
          logger.info(`[PRODUCTS CONTROLLER] ===========================================`);
          
          return res.json(newResult);
        } else {
          logger.error('[PRODUCTS CONTROLLER] ❌ Failed to seed skincare products');
        }
      } else {
        logger.info(`[PRODUCTS CONTROLLER] ✅ Sufficient products found (${result.total} >= 82)`);
        // Still return results even if exactly 82 or more
      }
    }

    logger.info('[PRODUCTS CONTROLLER] ========== SENDING RESPONSE TO CLIENT ==========');
    logger.info(`[PRODUCTS CONTROLLER] Final product count: ${result.products.length}`);
    logger.info(`[PRODUCTS CONTROLLER] Total in database: ${result.total}`);
    logger.info(`[PRODUCTS CONTROLLER] Page: ${result.page} of ${result.totalPages}`);
    logger.info(`[PRODUCTS CONTROLLER] Response status: 200 OK`);
    logger.info('[PRODUCTS CONTROLLER] ================================================');
    console.log(`[PRODUCTS CONTROLLER] ✅ Returning ${result.products.length} products (Total: ${result.total})`);
    
    res.json(result);
  } catch (error: any) {
    logger.error('[PRODUCTS CONTROLLER] Get products error:', error);
    logger.error('[PRODUCTS CONTROLLER] Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    logger.error('Get product error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    logger.error('Create product error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productsService.updateProduct(id, req.body);
    res.json(product);
  } catch (error: any) {
    logger.error('Update product error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productsService.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    logger.error('Delete product error:', error);
    res.status(400).json({ error: error.message });
  }
};
