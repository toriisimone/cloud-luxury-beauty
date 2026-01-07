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

  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
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
