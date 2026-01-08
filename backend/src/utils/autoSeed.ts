/**
 * Automatic database seeding on startup
 * Only seeds if database is empty (no products)
 */
import prisma from '../config/database';
import { logger } from '../config/logger';

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  images: string[];
  categoryName: string;
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Cloud Matte Lipstick – Rose Dust',
    slug: 'cloud-matte-lipstick-rose-dust',
    description: 'A velvety matte lipstick that feels light as air.',
    price: 24,
    stock: 200,
    featured: true,
    images: ['/products/lipstick-rose-dust.jpg'],
    categoryName: 'Lips',
  },
  {
    name: 'Lavender Mist Face Oil',
    slug: 'lavender-mist-face-oil',
    description: 'Luxury botanical oil for a radiant, dewy glow.',
    price: 48,
    stock: 150,
    featured: true,
    images: ['/products/lavender-face-oil.jpg'],
    categoryName: 'Face',
  },
  {
    name: 'Velvet Glow Blush',
    slug: 'velvet-glow-blush',
    description: 'The perfect-pink flush for every skin tone.',
    price: 28,
    stock: 180,
    featured: true,
    images: ['/products/velvet-blush.jpg'],
    categoryName: 'Face',
  },
  {
    name: 'Cloud Dew Setting Spray',
    slug: 'cloud-dew-setting-spray',
    description: 'A weightless mist that locks in a cloud-soft finish.',
    price: 32,
    stock: 160,
    featured: true,
    images: ['/products/setting-spray.jpg'],
    categoryName: 'Glow',
  },
  {
    name: 'Pink Sky Highlighter',
    slug: 'pink-sky-highlighter',
    description: 'A luminous glow inspired by sunset skies.',
    price: 30,
    stock: 140,
    featured: true,
    images: ['/products/highlighter-pink.jpg'],
    categoryName: 'Glow',
  },
];

const SEED_CATEGORIES = [
  { name: 'Lips', slug: 'lips', description: 'Luxurious lip products for every look' },
  { name: 'Face', slug: 'face', description: 'Foundation, blush, and face essentials' },
  { name: 'Glow', slug: 'glow', description: 'Highlighters and setting sprays for that perfect glow' },
  { name: 'Sets', slug: 'sets', description: 'Curated beauty bundles and collections' },
];

export async function autoSeedIfEmpty(): Promise<void> {
  try {
    logger.info('Checking if database needs seeding...');
    
    // Check if products exist
    const productCount = await prisma.product.count();
    
    if (productCount > 0) {
      logger.info(`Database already has ${productCount} products. Skipping auto-seed.`);
      return;
    }

    logger.info('Database is empty. Starting automatic seeding...');

    // Create or get categories
    const categoryMap = new Map<string, string>();
    
    for (const catData of SEED_CATEGORIES) {
      const category = await prisma.category.upsert({
        where: { slug: catData.slug },
        update: {},
        create: {
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          image: `/category-${catData.slug}.jpg`,
        },
      });
      categoryMap.set(catData.name, category.id);
      logger.info(`Category created/found: ${catData.name}`);
    }

    // Create products
    const createdProducts = [];
    for (const productData of SEED_PRODUCTS) {
      const categoryId = categoryMap.get(productData.categoryName);
      if (!categoryId) {
        logger.warn(`Category not found for product: ${productData.name}`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          featured: productData.featured,
          images: productData.images,
          categoryId: categoryId,
        },
      });
      createdProducts.push(product);
      logger.info(`Product created: ${productData.name} ($${productData.price})`);
    }

    logger.info(`Auto-seeding completed successfully! Created ${createdProducts.length} products and ${categoryMap.size} categories.`);
  } catch (error: any) {
    logger.error('Auto-seeding failed:', error);
    // Don't throw - we don't want to crash the server if seeding fails
    // The server can still run without seeded data
    logger.warn('Server will continue without seeded data. You may need to seed manually.');
  }
}
