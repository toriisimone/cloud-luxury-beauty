import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cloudluxury.com' },
    update: {},
    create: {
      email: 'admin@cloudluxury.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'CUSTOMER',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'makeup' },
      update: {},
      create: {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Luxurious makeup products for a flawless look',
        image: '/category-makeup.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'skincare' },
      update: {},
      create: {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Premium skincare for radiant, glowing skin',
        image: '/category-skincare.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'body' },
      update: {},
      create: {
        name: 'Body',
        slug: 'body',
        description: 'Body care products for silky smooth skin',
        image: '/category-body.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fragrance' },
      update: {},
      create: {
        name: 'Fragrance',
        slug: 'fragrance',
        description: 'Luxurious fragrances that captivate',
        image: '/category-fragrance.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tools' },
      update: {},
      create: {
        name: 'Tools',
        slug: 'tools',
        description: 'Professional beauty tools and brushes',
        image: '/category-tools.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bundles' },
      update: {},
      create: {
        name: 'Bundles',
        slug: 'bundles',
        description: 'Curated beauty bundles and sets',
        image: '/category-bundles.jpg',
      },
    }),
  ]);

  const makeupCategory = categories[0];
  const skincareCategory = categories[1];
  const bodyCategory = categories[2];
  const fragranceCategory = categories[3];
  const toolsCategory = categories[4];
  const bundlesCategory = categories[5];

  // Create products
  const products = await Promise.all([
    // Makeup products
    prisma.product.create({
      data: {
        name: 'Cloud Glow Liquid Foundation',
        slug: 'cloud-glow-liquid-foundation',
        description: 'A weightless, buildable foundation that delivers a cloud-soft, luminous finish. Infused with hydrating ingredients for all-day comfort.',
        price: 42.00,
        stock: 150,
        featured: true,
        images: ['/products/foundation-1.jpg', '/products/foundation-2.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Shade', value: 'Cloud Beige', stock: 30, sku: 'CGLF-CB' },
            { name: 'Shade', value: 'Rose Ivory', stock: 25, sku: 'CGLF-RI' },
            { name: 'Shade', value: 'Warm Sand', stock: 35, sku: 'CGLF-WS' },
            { name: 'Shade', value: 'Golden Honey', stock: 30, sku: 'CGLF-GH' },
            { name: 'Shade', value: 'Caramel', stock: 30, sku: 'CGLF-CA' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Blush Dream Powder Blush',
        slug: 'blush-dream-powder-blush',
        description: 'Silky-soft powder blush in dreamy shades. Buildable color that blends seamlessly for a natural, flushed glow.',
        price: 28.00,
        stock: 200,
        featured: true,
        images: ['/products/blush-1.jpg', '/products/blush-2.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Shade', value: 'Peach Dream', stock: 50, sku: 'BDPB-PD' },
            { name: 'Shade', value: 'Rose Cloud', stock: 50, sku: 'BDPB-RC' },
            { name: 'Shade', value: 'Lavender Mist', stock: 50, sku: 'BDPB-LM' },
            { name: 'Shade', value: 'Coral Sunset', stock: 50, sku: 'BDPB-CS' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Luxury Lip Gloss Set',
        slug: 'luxury-lip-gloss-set',
        description: 'A curated collection of high-shine lip glosses in the most flattering shades. Non-sticky formula with a plumping effect.',
        price: 38.00,
        stock: 120,
        featured: false,
        images: ['/products/lipgloss-1.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Set', value: 'Nude Collection', stock: 40, sku: 'LLGS-NC' },
            { name: 'Set', value: 'Berry Collection', stock: 40, sku: 'LLGS-BC' },
            { name: 'Set', value: 'Pink Collection', stock: 40, sku: 'LLGS-PC' },
          ],
        },
      },
    }),

    // Skincare products
    prisma.product.create({
      data: {
        name: 'Cloud Hydrating Cleanser',
        slug: 'cloud-hydrating-cleanser',
        description: 'Gentle, hydrating cleanser that removes makeup and impurities while maintaining your skin\'s natural moisture barrier.',
        price: 32.00,
        stock: 180,
        featured: true,
        images: ['/products/cleanser-1.jpg'],
        categoryId: skincareCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Luxury Face Serum',
        slug: 'luxury-face-serum',
        description: 'Potent serum with hyaluronic acid and vitamin C for brightening and hydration. Lightweight formula absorbs instantly.',
        price: 65.00,
        stock: 100,
        featured: true,
        images: ['/products/serum-1.jpg'],
        categoryId: skincareCategory.id,
        variants: {
          create: [
            { name: 'Size', value: '30ml', price: 65.00, stock: 50, sku: 'LFS-30' },
            { name: 'Size', value: '50ml', price: 95.00, stock: 50, sku: 'LFS-50' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Rose Gold Night Cream',
        slug: 'rose-gold-night-cream',
        description: 'Rich, luxurious night cream with rose gold particles. Replenishes and repairs skin while you sleep.',
        price: 78.00,
        stock: 90,
        featured: false,
        images: ['/products/nightcream-1.jpg'],
        categoryId: skincareCategory.id,
      },
    }),

    // Body products
    prisma.product.create({
      data: {
        name: 'Silky Body Lotion',
        slug: 'silky-body-lotion',
        description: 'Ultra-hydrating body lotion with shea butter and coconut oil. Leaves skin silky smooth and delicately scented.',
        price: 35.00,
        stock: 150,
        featured: false,
        images: ['/products/bodylotion-1.jpg'],
        categoryId: bodyCategory.id,
        variants: {
          create: [
            { name: 'Size', value: '250ml', price: 35.00, stock: 75, sku: 'SBL-250' },
            { name: 'Size', value: '500ml', price: 58.00, stock: 75, sku: 'SBL-500' },
          ],
        },
      },
    }),

    // Fragrance
    prisma.product.create({
      data: {
        name: 'Cloud Luxury Eau de Parfum',
        slug: 'cloud-luxury-eau-de-parfum',
        description: 'A dreamy, ethereal fragrance with notes of white flowers, vanilla, and soft musk. Long-lasting and captivating.',
        price: 95.00,
        stock: 80,
        featured: true,
        images: ['/products/perfume-1.jpg'],
        categoryId: fragranceCategory.id,
        variants: {
          create: [
            { name: 'Size', value: '50ml', price: 95.00, stock: 40, sku: 'CLEP-50' },
            { name: 'Size', value: '100ml', price: 165.00, stock: 40, sku: 'CLEP-100' },
          ],
        },
      },
    }),

    // Tools
    prisma.product.create({
      data: {
        name: 'Luxury Brush Set',
        slug: 'luxury-brush-set',
        description: 'Professional-grade brush set with soft, synthetic bristles. Includes all essential brushes for a complete makeup look.',
        price: 85.00,
        stock: 60,
        featured: false,
        images: ['/products/brushes-1.jpg'],
        categoryId: toolsCategory.id,
      },
    }),

    // Bundles
    prisma.product.create({
      data: {
        name: 'Complete Glow Bundle',
        slug: 'complete-glow-bundle',
        description: 'Everything you need for a radiant look. Includes foundation, blush, lip gloss, and skincare essentials.',
        price: 185.00,
        stock: 40,
        featured: true,
        images: ['/products/bundle-1.jpg'],
        categoryId: bundlesCategory.id,
      },
    }),
  ]);

  // Create coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minPurchase: 50,
        active: true,
        expiresAt: new Date('2025-12-31'),
        usageLimit: 1000,
        description: '10% off your first order over $50',
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SAVE20',
        type: 'PERCENTAGE',
        value: 20,
        minPurchase: 100,
        maxDiscount: 50,
        active: true,
        expiresAt: new Date('2025-12-31'),
        usageLimit: 500,
        description: '20% off orders over $100 (max $50 discount)',
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        type: 'FIXED',
        value: 10,
        minPurchase: 75,
        active: true,
        expiresAt: new Date('2025-12-31'),
        description: 'Free shipping on orders over $75',
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'MAKEUP15',
        type: 'PERCENTAGE',
        value: 15,
        categoryId: makeupCategory.id,
        active: true,
        expiresAt: new Date('2025-12-31'),
        description: '15% off all makeup products',
      },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log(`Admin user: admin@cloudluxury.com / Admin123!`);
  console.log(`Customer user: customer@example.com / Customer123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
