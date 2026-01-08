import prisma from '../config/database';

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

  const { logger } = await import('../config/logger');
  logger.info('[PRODUCTS SERVICE] ========== GET PRODUCTS ==========');
  logger.info('[PRODUCTS SERVICE] Params:', {
    categoryId,
    search,
    minPrice,
    maxPrice,
    featured,
    page,
    limit,
    skip,
  });

  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
    logger.info(`[PRODUCTS SERVICE] Filtering by categoryId: ${categoryId}`);
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

  logger.info(`[PRODUCTS SERVICE] Found ${products.length} products (total: ${total})`);
  if (products.length > 0) {
    logger.info(`[PRODUCTS SERVICE] First product: ${products[0].name} (Category: ${products[0].category?.name || 'N/A'})`);
  } else {
    logger.warn('[PRODUCTS SERVICE] ⚠️ No products found with current filters');
    // Log total products in database
    const totalInDb = await prisma.product.count();
    logger.info(`[PRODUCTS SERVICE] Total products in database: ${totalInDb}`);
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      logger.info(`[PRODUCTS SERVICE] Category: ${category?.name || 'NOT FOUND'} (ID: ${categoryId})`);
    }
  }

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
