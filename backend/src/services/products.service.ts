import prisma from '../config/database';
import { logger } from '../config/logger';

// Startup log to confirm service is loaded
logger.info('[PRODUCTS SERVICE] ✅ Products service module loaded and ready');

export interface GetProductsParams {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page: number;
  limit: number;
}

export const getProducts = async (params: GetProductsParams) => {
  const { categoryId, search, minPrice, maxPrice, featured, page, limit } = params;
  const skip = (page - 1) * limit;

  logger.info('[PRODUCTS SERVICE] ========== GET PRODUCTS CALLED ==========');
  logger.info('[PRODUCTS SERVICE] Function called at:', new Date().toISOString());
  logger.info('[PRODUCTS SERVICE] Params received:', JSON.stringify({
    categoryId,
    search,
    minPrice,
    maxPrice,
    featured,
    page,
    limit,
    skip,
  }, null, 2));

  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
    logger.info(`[PRODUCTS SERVICE] ========== CATEGORY FILTER ==========`);
    logger.info(`[PRODUCTS SERVICE] Filtering by categoryId: ${categoryId}`);
    
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, slug: true },
    });
    
    if (category) {
      logger.info(`[PRODUCTS SERVICE] Category verified:`, {
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
    } else {
      logger.error(`[PRODUCTS SERVICE] ❌ ERROR: Category ID ${categoryId} does not exist in database!`);
    }
    logger.info(`[PRODUCTS SERVICE] ======================================`);
  } else {
    logger.info('[PRODUCTS SERVICE] No categoryId filter - fetching all products');
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  logger.info('[PRODUCTS SERVICE] Where clause:', JSON.stringify(where, null, 2));

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  logger.info(`[PRODUCTS SERVICE] ========== QUERY RESULTS ==========`);
  logger.info(`[PRODUCTS SERVICE] Products found: ${products.length}`);
  logger.info(`[PRODUCTS SERVICE] Total matching: ${total}`);
  
  if (products.length > 0) {
    logger.info(`[PRODUCTS SERVICE] ✅ SUCCESS: Products found!`);
    logger.info(`[PRODUCTS SERVICE] First product:`, {
      id: products[0].id,
      name: products[0].name,
      categoryId: products[0].categoryId,
      categoryName: products[0].category?.name || 'N/A',
      price: products[0].price,
    });
    if (products.length > 1) {
      logger.info(`[PRODUCTS SERVICE] Last product:`, {
        id: products[products.length - 1].id,
        name: products[products.length - 1].name,
      });
    }
  } else {
    logger.warn('[PRODUCTS SERVICE] ⚠️⚠️⚠️ NO PRODUCTS FOUND ⚠️⚠️⚠️');
    logger.warn('[PRODUCTS SERVICE] Query returned empty array!');
    
    // Log total products in database
    const totalInDb = await prisma.product.count();
    logger.info(`[PRODUCTS SERVICE] Total products in entire database: ${totalInDb}`);
    
    if (categoryId) {
      const category = await prisma.category.findUnique({ 
        where: { id: categoryId },
        include: { _count: { select: { products: true } } },
      });
      logger.info(`[PRODUCTS SERVICE] Category details:`, {
        id: category?.id || 'NOT FOUND',
        name: category?.name || 'NOT FOUND',
        productCount: category?._count?.products || 0,
      });
    } else {
      logger.info(`[PRODUCTS SERVICE] No categoryId provided - querying all products`);
    }
  }
  logger.info(`[PRODUCTS SERVICE] ======================================`);

  logger.info('[PRODUCTS SERVICE] ========== END GET PRODUCTS ==========');

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
    },
  });
};

export const createProduct = async (data: any) => {
  const { variants, ...productData } = data;

  const slug = productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-');

  const product = await prisma.product.create({
    data: {
      ...productData,
      slug,
      variants: variants
        ? {
            create: variants,
          }
        : undefined,
    },
    include: {
      category: true,
      variants: true,
    },
  });

  return product;
};

export const updateProduct = async (id: string, data: any) => {
  const { variants, ...productData } = data;

  if (productData.name && !productData.slug) {
    productData.slug = productData.name.toLowerCase().replace(/\s+/g, '-');
  }

  const product = await prisma.product.update({
    where: { id },
    data: productData,
    include: {
      category: true,
      variants: true,
    },
  });

  return product;
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
