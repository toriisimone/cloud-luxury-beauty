import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if products already exist
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log(`Database already has ${existingProducts} products. Skipping product seeding.`);
    console.log('To re-seed, delete all products first.');
    return;
  }

  console.log('Database is empty. Creating products...');

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

  // Create categories - matching navbar structure
  const categories = await Promise.all([
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
      where: { slug: 'balms' },
      update: {},
      create: {
        name: 'Balms',
        slug: 'balms',
        description: 'Nourishing balms for lips and skin',
        image: '/category-balms.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sets' },
      update: {},
      create: {
        name: 'Sets',
        slug: 'sets',
        description: 'Curated beauty bundles and sets',
        image: '/category-sets.jpg',
      },
    }),
  ]);

  const skincareCategory = categories[0];
  const makeupCategory = categories[1];
  const bodyCategory = categories[2];
  const fragranceCategory = categories[3];
  const balmsCategory = categories[4];
  const setsCategory = categories[5];

  // Helper function to generate slug from name
  const slugify = (text: string) => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Helper function to generate product data
  const createProduct = (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    featured: boolean;
    categoryId: string;
    images?: string[];
    variants?: Array<{ name: string; value: string; price?: number; stock: number; sku: string }>;
  }) => {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        price: data.price,
        stock: data.stock,
        featured: data.featured,
        images: data.images || [`/products/${slugify(data.name)}.jpg`],
        categoryId: data.categoryId,
        variants: data.variants ? {
          create: data.variants.map(v => ({
            name: v.name,
            value: v.value,
            price: v.price,
            stock: v.stock,
            sku: v.sku,
          })),
        } : undefined,
      },
    });
  };

  // Create products - starting with the specific products requested
  const baseProducts = await Promise.all([
    // Cloud Matte Lipstick – Rose Dust ($24)
    prisma.product.create({
      data: {
        name: 'Cloud Matte Lipstick – Rose Dust',
        slug: 'cloud-matte-lipstick-rose-dust',
        description: 'A velvety matte lipstick in the perfect rose dust shade. Long-wearing, weightless formula that glides on smoothly for a cloud-soft finish.',
        price: 24.00,
        stock: 200,
        featured: true,
        images: ['/products/lipstick-rose-dust.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Shade', value: 'Rose Dust', stock: 200, sku: 'CML-RD' },
          ],
        },
      },
    }),
    // Lavender Mist Face Oil ($48)
    prisma.product.create({
      data: {
        name: 'Lavender Mist Face Oil',
        slug: 'lavender-mist-face-oil',
        description: 'A luxurious face oil infused with lavender and cloud-soft botanicals. Nourishes and hydrates for a dewy, luminous complexion.',
        price: 48.00,
        stock: 150,
        featured: true,
        images: ['/products/lavender-face-oil.jpg'],
        categoryId: skincareCategory.id,
        variants: {
          create: [
            { name: 'Size', value: '30ml', price: 48.00, stock: 75, sku: 'LMFO-30' },
            { name: 'Size', value: '50ml', price: 75.00, stock: 75, sku: 'LMFO-50' },
          ],
        },
      },
    }),
    // Velvet Glow Blush ($28)
    prisma.product.create({
      data: {
        name: 'Velvet Glow Blush',
        slug: 'velvet-glow-blush',
        description: 'Silky-soft powder blush that delivers a natural, flushed glow. Buildable color that blends seamlessly for a cloud-kissed complexion.',
        price: 28.00,
        stock: 180,
        featured: true,
        images: ['/products/velvet-blush.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Shade', value: 'Peach Cloud', stock: 45, sku: 'VGB-PC' },
            { name: 'Shade', value: 'Rose Mist', stock: 45, sku: 'VGB-RM' },
            { name: 'Shade', value: 'Lavender Dream', stock: 45, sku: 'VGB-LD' },
            { name: 'Shade', value: 'Coral Sunset', stock: 45, sku: 'VGB-CS' },
          ],
        },
      },
    }),
    // Cloud Dew Setting Spray ($32)
    prisma.product.create({
      data: {
        name: 'Cloud Dew Setting Spray',
        slug: 'cloud-dew-setting-spray',
        description: 'A weightless setting spray that locks in your look with a dewy, cloud-soft finish. Keeps makeup fresh all day with hydrating mist.',
        price: 32.00,
        stock: 160,
        featured: true,
        images: ['/products/setting-spray.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Size', value: '100ml', price: 32.00, stock: 80, sku: 'CDSS-100' },
            { name: 'Size', value: '200ml', price: 55.00, stock: 80, sku: 'CDSS-200' },
          ],
        },
      },
    }),
    // Pink Sky Highlighter ($30)
    prisma.product.create({
      data: {
        name: 'Pink Sky Highlighter',
        slug: 'pink-sky-highlighter',
        description: 'A luminous highlighter in a dreamy pink sky shade. Creates a soft, ethereal glow that catches the light like clouds at sunset.',
        price: 30.00,
        stock: 140,
        featured: true,
        images: ['/products/highlighter-pink.jpg'],
        categoryId: makeupCategory.id,
        variants: {
          create: [
            { name: 'Shade', value: 'Pink Sky', stock: 140, sku: 'PSH-PS' },
          ],
        },
      },
    }),
    // Additional products for variety
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
        categoryId: setsCategory.id,
      },
    }),
  ]);

  // Generate additional products programmatically (200+ total)
  const additionalProducts: Array<Promise<any>> = [];

  // Makeup Products (60+ products)
  const makeupProducts = [
    { name: 'Cloud Soft Concealer', price: 26, stock: 180, featured: true },
    { name: 'Luminous Powder Highlighter', price: 32, stock: 150, featured: true },
    { name: 'Velvet Matte Lipstick', price: 24, stock: 200, featured: true },
    { name: 'Glossy Lip Tint', price: 22, stock: 180, featured: false },
    { name: 'Cloud Blur Primer', price: 28, stock: 160, featured: true },
    { name: 'Dewy Skin Tint', price: 36, stock: 140, featured: true },
    { name: 'Soft Focus Powder', price: 30, stock: 150, featured: false },
    { name: 'Cloud Kiss Mascara', price: 26, stock: 170, featured: true },
    { name: 'Lash Lift Serum', price: 34, stock: 120, featured: false },
    { name: 'Brow Gel Cloud', price: 24, stock: 160, featured: false },
    { name: 'Eyeshadow Palette Dream', price: 48, stock: 100, featured: true },
    { name: 'Cloud Glow Bronzer', price: 28, stock: 150, featured: true },
    { name: 'Rose Petal Blush', price: 26, stock: 180, featured: true },
    { name: 'Liquid Lipstick Cloud', price: 24, stock: 200, featured: false },
    { name: 'Translucent Setting Powder', price: 32, stock: 140, featured: true },
    { name: 'Cloud Cream Blush', price: 28, stock: 160, featured: true },
    { name: 'Luminous Foundation', price: 42, stock: 130, featured: true },
    { name: 'Cloud Soft Eyeliner', price: 22, stock: 170, featured: false },
    { name: 'Glossy Lip Balm', price: 20, stock: 200, featured: false },
    { name: 'Cloud Glow Palette', price: 52, stock: 90, featured: true },
  ];

  makeupProducts.forEach((p, i) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `Premium ${p.name.toLowerCase()} for a flawless, cloud-soft finish. Long-wearing formula that feels weightless.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: makeupCategory.id,
      variants: i % 3 === 0 ? [
        { name: 'Shade', value: 'Natural', stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-N` },
        { name: 'Shade', value: 'Warm', stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-W` },
      ] : undefined,
    }));
  });

  // Skincare Products (50+ products)
  const skincareProducts = [
    { name: 'Cloud Hydrating Serum', price: 58, stock: 120, featured: true },
    { name: 'Lavender Face Mist', price: 32, stock: 150, featured: true },
    { name: 'Cloud Soft Moisturizer', price: 48, stock: 140, featured: true },
    { name: 'Rose Gold Eye Cream', price: 52, stock: 110, featured: true },
    { name: 'Cloud Glow Toner', price: 36, stock: 130, featured: false },
    { name: 'Luxury Face Mask', price: 42, stock: 100, featured: true },
    { name: 'Cloud Dew Essence', price: 55, stock: 115, featured: true },
    { name: 'Gentle Exfoliating Scrub', price: 38, stock: 125, featured: false },
    { name: 'Cloud Soft Cleansing Balm', price: 44, stock: 120, featured: true },
    { name: 'Vitamin C Brightening Serum', price: 62, stock: 105, featured: true },
    { name: 'Hyaluronic Acid Cloud', price: 56, stock: 118, featured: true },
    { name: 'Cloud Soft Night Cream', price: 68, stock: 95, featured: true },
    { name: 'Rose Petal Face Oil', price: 72, stock: 90, featured: true },
    { name: 'Cloud Glow Sunscreen', price: 34, stock: 140, featured: true },
    { name: 'Luxury Face Wash', price: 32, stock: 145, featured: false },
  ];

  skincareProducts.forEach((p, i) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `Luxurious ${p.name.toLowerCase()} infused with cloud-soft botanicals. Nourishes and hydrates for radiant, glowing skin.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: skincareCategory.id,
      variants: i % 4 === 0 ? [
        { name: 'Size', value: '30ml', price: p.price, stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-30` },
        { name: 'Size', value: '50ml', price: p.price * 1.5, stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-50` },
      ] : undefined,
    }));
  });

  // Body Products (30+ products)
  const bodyProducts = [
    { name: 'Cloud Soft Body Lotion', price: 38, stock: 130, featured: true },
    { name: 'Lavender Body Wash', price: 28, stock: 150, featured: false },
    { name: 'Rose Gold Body Oil', price: 52, stock: 100, featured: true },
    { name: 'Cloud Dew Body Mist', price: 32, stock: 140, featured: true },
    { name: 'Luxury Body Scrub', price: 42, stock: 120, featured: true },
    { name: 'Cloud Soft Hand Cream', price: 24, stock: 160, featured: false },
    { name: 'Rose Petal Body Butter', price: 48, stock: 110, featured: true },
    { name: 'Cloud Glow Body Serum', price: 56, stock: 95, featured: true },
  ];

  bodyProducts.forEach((p) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `Ultra-hydrating ${p.name.toLowerCase()} that leaves skin silky smooth and delicately scented.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: bodyCategory.id,
    }));
  });

  // Fragrance Products (25+ products)
  const fragranceProducts = [
    { name: 'Cloud Dream Perfume', price: 98, stock: 85, featured: true },
    { name: 'Lavender Mist Eau de Toilette', price: 78, stock: 95, featured: true },
    { name: 'Rose Gold Fragrance', price: 108, stock: 75, featured: true },
    { name: 'Cloud Soft Body Spray', price: 38, stock: 130, featured: false },
    { name: 'Luxury Perfume Oil', price: 88, stock: 90, featured: true },
    { name: 'Cloud Glow Eau de Parfum', price: 115, stock: 70, featured: true },
  ];

  fragranceProducts.forEach((p) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `A dreamy, ethereal ${p.name.toLowerCase()} with captivating notes. Long-lasting and luxurious.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: fragranceCategory.id,
      variants: [
        { name: 'Size', value: '50ml', price: p.price, stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-50` },
        { name: 'Size', value: '100ml', price: p.price * 1.7, stock: Math.floor(p.stock / 2), sku: `${slugify(p.name).substring(0, 8).toUpperCase()}-100` },
      ],
    }));
  });

  // Balms Products (20+ products)
  const balmsProducts = [
    { name: 'Cloud Soft Lip Balm', price: 18, stock: 200, featured: true },
    { name: 'Rose Petal Balm', price: 24, stock: 180, featured: true },
    { name: 'Lavender Healing Balm', price: 28, stock: 160, featured: true },
    { name: 'Cloud Glow Face Balm', price: 42, stock: 120, featured: true },
    { name: 'Luxury Cuticle Balm', price: 22, stock: 170, featured: false },
    { name: 'Cloud Soft Hand Balm', price: 26, stock: 150, featured: false },
  ];

  balmsProducts.forEach((p) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `Nourishing ${p.name.toLowerCase()} with cloud-soft botanicals. Provides deep hydration and protection.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: balmsCategory.id,
    }));
  });

  // Sets Products (15+ products)
  const setsProducts = [
    { name: 'Complete Skincare Set', price: 185, stock: 50, featured: true },
    { name: 'Cloud Glow Makeup Set', price: 165, stock: 60, featured: true },
    { name: 'Luxury Beauty Bundle', price: 225, stock: 40, featured: true },
    { name: 'Cloud Soft Essentials', price: 145, stock: 70, featured: true },
    { name: 'Rose Gold Collection', price: 195, stock: 55, featured: true },
  ];

  setsProducts.forEach((p) => {
    additionalProducts.push(createProduct({
      name: p.name,
      description: `Curated ${p.name.toLowerCase()} with everything you need for a complete beauty routine.`,
      price: p.price,
      stock: p.stock,
      featured: p.featured,
      categoryId: setsCategory.id,
    }));
  });

  // Create all additional products
  const additionalProductsCreated = await Promise.all(additionalProducts);
  const allProducts = [...baseProducts, ...additionalProductsCreated];

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
  console.log(`Created ${allProducts.length} products`);
  console.log(`Created ${categories.length} categories`);
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
