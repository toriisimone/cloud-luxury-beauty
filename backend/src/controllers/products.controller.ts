import { Request, Response } from 'express';
import * as productsService from '../services/products.service';
import { logger } from '../config/logger';
import * as amazonService from '../services/amazonApi.service';

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
    
    // CRITICAL: If Skincare category, try Amazon API FIRST
    if (category && (category as string).toLowerCase() === 'skincare') {
      logger.info('[PRODUCTS CONTROLLER] ========== SKINCARE CATEGORY DETECTED ==========');
      logger.info('[PRODUCTS CONTROLLER] Attempting to fetch from Amazon API first...');
      console.log('[PRODUCTS CONTROLLER] 🛒 SKINCARE CATEGORY - Calling Amazon API...');
      
      try {
        const amazonProducts = await amazonService.getSkincareProducts();
        logger.info(`[PRODUCTS CONTROLLER] Amazon API returned ${amazonProducts.length} products`);
        console.log(`[PRODUCTS CONTROLLER] Amazon API returned ${amazonProducts.length} products`);
        
        if (amazonProducts.length > 0) {
          logger.info('[PRODUCTS CONTROLLER] ✅ Returning Amazon products');
          console.log('[PRODUCTS CONTROLLER] ✅ Returning Amazon products');
          
          // Convert Amazon products to the expected format
          const convertedProducts = amazonProducts.map(p => ({
            id: p.asin,
            name: p.title,
            description: p.title, // Use title as description
            price: p.price,
            stock: 999, // Amazon products are always in stock
            featured: p.tags?.includes('Best-seller') || p.tags?.includes('Award Winner') || false,
            images: p.imageUrl ? [p.imageUrl] : [],
            categoryId: '', // Will be set below
            category: null, // Will be populated if needed
            variants: p.size ? [{ id: 'size', name: 'Size', value: p.size }] : [],
            rating: p.rating,
            reviewCount: p.reviewCount,
            affiliateUrl: p.affiliateUrl,
          }));
          
          // Get category ID if needed
          let finalCategoryId = categoryId as string | undefined;
          if (!finalCategoryId) {
            const { getCategoryByName } = await import('../services/categories.service');
            const categoryObj = await getCategoryByName('Skincare');
            if (categoryObj) {
              finalCategoryId = categoryObj.id;
            }
          }
          
          // Set categoryId on all products
          convertedProducts.forEach(p => {
            if (finalCategoryId) {
              (p as any).categoryId = finalCategoryId;
            }
          });
          
          const pageNum = parseInt(page as string, 10);
          const limitNum = parseInt(limit as string, 10);
          const startIndex = (pageNum - 1) * limitNum;
          const endIndex = startIndex + limitNum;
          const paginatedProducts = convertedProducts.slice(startIndex, endIndex);
          
          logger.info('[PRODUCTS CONTROLLER] ========== RETURNING AMAZON PRODUCTS ==========');
          logger.info(`[PRODUCTS CONTROLLER] Total Amazon products: ${convertedProducts.length}`);
          logger.info(`[PRODUCTS CONTROLLER] Paginated products: ${paginatedProducts.length}`);
          logger.info(`[PRODUCTS CONTROLLER] Page: ${pageNum}/${Math.ceil(convertedProducts.length / limitNum)}`);
          
          return res.json({
            products: paginatedProducts,
            total: convertedProducts.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(convertedProducts.length / limitNum),
            source: 'amazon',
          });
        } else {
          logger.warn('[PRODUCTS CONTROLLER] ⚠️ Amazon API returned 0 products, falling back to database');
          console.log('[PRODUCTS CONTROLLER] ⚠️ Amazon API returned 0 products, falling back to database');
        }
      } catch (amazonError: any) {
        logger.error('[PRODUCTS CONTROLLER] ❌ Amazon API error:', amazonError);
        logger.error('[PRODUCTS CONTROLLER] Error stack:', amazonError.stack);
        console.error('[PRODUCTS CONTROLLER] ❌ Amazon API error:', amazonError.message);
        logger.warn('[PRODUCTS CONTROLLER] Falling back to database products');
        // Continue to database fallback below
      }
      
      logger.info('[PRODUCTS CONTROLLER] ==========================================');
    }

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
    
    // If Skincare category and no products, check if we need to seed
    if (category && (category as string).toLowerCase() === 'skincare' && result.products.length === 0) {
      logger.warn('[PRODUCTS CONTROLLER] ⚠️ No skincare products found! Attempting to seed...');
      const { autoSeedSkincareIfEmpty } = await import('../utils/autoSeedSkincare');
      const seeded = await autoSeedSkincareIfEmpty();
      if (seeded) {
        logger.info('[PRODUCTS CONTROLLER] ✅ Skincare products seeded, fetching again...');
        // Fetch again after seeding
        const newResult = await productsService.getProducts({
          categoryId: finalCategoryId,
          search: search as string,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
          featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10),
        });
        logger.info(`[PRODUCTS CONTROLLER] After seeding: ${newResult.products.length} products`);
        return res.json(newResult);
      }
    }

    logger.info('[PRODUCTS CONTROLLER] ========== SENDING RESPONSE TO CLIENT ==========');
    logger.info(`[PRODUCTS CONTROLLER] Final product count: ${result.products.length}`);
    logger.info(`[PRODUCTS CONTROLLER] Response status: 200 OK`);
    logger.info('[PRODUCTS CONTROLLER] ================================================');
    
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
