// Product data structure and category detection
export interface Product {
  id: string;
  brand: string;
  title: string;
  price: number;
  priceRange?: { min: number; max: number };
  image: string;
  imageUrl?: string; // Original Sephora URL
  badge?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string;
  sponsored?: boolean;
  topCategory: string;
  subCategory: string;
  flags: string[];
  basePrice: number;
  displayPrice: number;
  slug: string;
}

export type TopCategory = 
  | 'Skincare' 
  | 'Makeup' 
  | 'Hair' 
  | 'Fragrance' 
  | 'Body';

export interface CategoryStructure {
  topCategory: TopCategory;
  subCategories: string[];
  imageMenuBlocks: string[];
}

// Category mapping structure with subcategories and image menu blocks
const CATEGORY_MAPPINGS: Record<TopCategory, { subCategories: string[]; imageMenuBlocks: string[] }> = {
  'Skincare': {
    subCategories: [
      'Cleansers', 'Toners & Essences', 'Serums & Treatments', 'Moisturizers', 
      'Eye Creams', 'Sunscreen', 'Masks', 'Exfoliators', 'Face Oils', 
      'Acne & Blemish', 'Anti-Aging', 'Hydration', 'Brightening', 'Pore Care', 
      'Sensitive Skin', 'Tools'
    ],
    imageMenuBlocks: [
      'Cleansers',
      'Serums & Treatments',
      'Moisturizers',
      'Sunscreen',
      'Masks'
    ]
  },
  'Makeup': {
    subCategories: [
      'Complexion/Face', 'Lips', 'Eyes', 'Palettes', 'Brushes', 'Sets'
    ],
    imageMenuBlocks: [
      'Complexion/Face',
      'Lips',
      'Eyes',
      'Palettes',
      'Brushes'
    ]
  },
  'Hair': {
    subCategories: [
      'Shampoo', 'Conditioner', 'Treatments', 'Styling', 'Tools'
    ],
    imageMenuBlocks: [
      'Shampoo',
      'Conditioner',
      'Treatments',
      'Styling',
      'Tools'
    ]
  },
  'Fragrance': {
    subCategories: [
      'Women', 'Men', 'Unisex', 'Rollerballs', 'Sets', 'Mists'
    ],
    imageMenuBlocks: [
      'Women',
      'Men',
      'Unisex',
      'Mists',
      'Sets'
    ]
  },
  'Body': {
    subCategories: [
      'Lotions', 'Creams', 'Oils', 'Scrubs', 'Deodorant', 'Mists'
    ],
    imageMenuBlocks: [
      'Lotions',
      'Creams',
      'Scrubs',
      'Mists',
      'Oils'
    ]
  }
};

// Category detection patterns
const detectCategory = (brand: string, title: string, flags: string[]): { topCategory: TopCategory; subCategory: string } => {
  const titleLower = title.toLowerCase();
  const brandLower = brand.toLowerCase();
  const combined = `${titleLower} ${brandLower}`;

  // Check flags first - map to core categories
  // Limited Edition and Online Only are now flags, not categories
  // They'll be assigned to appropriate core category based on product type

  // Skincare patterns
  if (
    combined.includes('serum') || combined.includes('toner') || combined.includes('cleanser') ||
    combined.includes('moisturizer') || combined.includes('cream') && !combined.includes('foundation') ||
    combined.includes('mask') || combined.includes('exfoliat') || combined.includes('sunscreen') ||
    combined.includes('spf') || combined.includes('eye cream') || combined.includes('face oil') ||
    combined.includes('hydrat') || combined.includes('anti-aging') || combined.includes('brighten') ||
    combined.includes('acne') || combined.includes('blemish') || combined.includes('pore') ||
    titleLower.includes('skincare') || titleLower.includes('skin care')
  ) {
    let subCategory = 'Serums & Treatments';
    if (combined.includes('cleanser') || combined.includes('wash')) subCategory = 'Cleansers';
    else if (combined.includes('toner') || combined.includes('essence')) subCategory = 'Toners & Essences';
    else if (combined.includes('serum')) subCategory = 'Serums & Treatments';
    else if (combined.includes('moisturizer') || (combined.includes('cream') && !combined.includes('foundation'))) subCategory = 'Moisturizers';
    else if (combined.includes('eye')) subCategory = 'Eye Creams';
    else if (combined.includes('sunscreen') || combined.includes('spf')) subCategory = 'Sunscreen';
    else if (combined.includes('mask')) subCategory = 'Masks';
    else if (combined.includes('exfoliat')) subCategory = 'Exfoliators';
    else if (combined.includes('oil') && combined.includes('face')) subCategory = 'Face Oils';
    else if (combined.includes('acne') || combined.includes('blemish')) subCategory = 'Acne & Blemish';
    else if (combined.includes('anti-aging') || combined.includes('anti aging')) subCategory = 'Anti-Aging';
    else if (combined.includes('brighten')) subCategory = 'Brightening';
    else if (combined.includes('pore')) subCategory = 'Pore Care';
    else if (combined.includes('hydrat')) subCategory = 'Hydration';
    
    return { topCategory: 'Skincare', subCategory };
  }

  // Makeup patterns
  if (
    combined.includes('foundation') || combined.includes('concealer') || combined.includes('powder') ||
    combined.includes('blush') || combined.includes('bronzer') || combined.includes('highlighter') ||
    combined.includes('lipstick') || combined.includes('lip gloss') || combined.includes('lip liner') ||
    combined.includes('mascara') || combined.includes('eyeliner') || combined.includes('eyeshadow') ||
    combined.includes('palette') || combined.includes('makeup') || combined.includes('make-up')
  ) {
    let subCategory = 'Complexion/Face';
    if (combined.includes('lip')) subCategory = 'Lips';
    else if (combined.includes('eye') || combined.includes('mascara') || combined.includes('eyeliner') || combined.includes('eyeshadow')) subCategory = 'Eyes';
    else if (combined.includes('palette')) subCategory = 'Palettes';
    else if (combined.includes('brush')) subCategory = 'Brushes';
    
    return { topCategory: 'Makeup', subCategory };
  }

  // Hair patterns
  if (
    combined.includes('shampoo') || combined.includes('conditioner') || combined.includes('hair') ||
    combined.includes('scalp') || combined.includes('leave-in') || combined.includes('heat protectant')
  ) {
    let subCategory = 'Shampoo';
    if (combined.includes('conditioner')) subCategory = 'Conditioner';
    else if (combined.includes('treatment') || combined.includes('serum') || combined.includes('leave-in')) subCategory = 'Treatments';
    else if (combined.includes('spray') || combined.includes('mousse') || combined.includes('gel')) subCategory = 'Styling';
    
    return { topCategory: 'Hair', subCategory };
  }

  // Fragrance patterns
  if (
    combined.includes('perfume') || combined.includes('fragrance') || combined.includes('eau de') ||
    combined.includes('parfum') || combined.includes('cologne') || combined.includes('mist')
  ) {
    let subCategory = 'Women';
    if (combined.includes('men') || combined.includes('cologne')) subCategory = 'Men';
    else if (combined.includes('unisex')) subCategory = 'Unisex';
    else if (combined.includes('rollerball') || combined.includes('mini')) subCategory = 'Rollerballs';
    
    return { topCategory: 'Fragrance', subCategory };
  }

  // Body patterns
  if (
    combined.includes('body') || combined.includes('lotion') || combined.includes('body cream') ||
    combined.includes('body oil') || combined.includes('scrub') || combined.includes('deodorant') ||
    combined.includes('body mist')
  ) {
    let subCategory = 'Lotions';
    if (combined.includes('cream')) subCategory = 'Creams';
    else if (combined.includes('oil')) subCategory = 'Oils';
    else if (combined.includes('scrub')) subCategory = 'Scrubs';
    else if (combined.includes('deodorant')) subCategory = 'Deodorant';
    else if (combined.includes('mist')) subCategory = 'Mists';
    
    return { topCategory: 'Body', subCategory };
  }

  // Tools & Brushes - map to appropriate category
  if (
    combined.includes('brush') || combined.includes('sponge') || combined.includes('tool') ||
    combined.includes('curler') || combined.includes('applicator')
  ) {
    // Makeup brushes go to Makeup, skincare tools to Skincare, hair tools to Hair
    if (combined.includes('makeup') || combined.includes('blush brush') || combined.includes('foundation brush') || combined.includes('eyeshadow brush')) {
      return { topCategory: 'Makeup', subCategory: 'Brushes' };
    } else if (combined.includes('skincare') || combined.includes('face tool') || combined.includes('cleansing tool')) {
      return { topCategory: 'Skincare', subCategory: 'Tools' };
    } else if (combined.includes('hair tool') || combined.includes('hair brush')) {
      return { topCategory: 'Hair', subCategory: 'Tools' };
    }
    // Default to Makeup for brushes
    return { topCategory: 'Makeup', subCategory: 'Brushes' };
  }

  // Gifts & Sets - map based on product type
  if (combined.includes('set') || combined.includes('bundle') || combined.includes('gift')) {
    // Try to determine category from set contents
    if (combined.includes('makeup') || combined.includes('lip') || combined.includes('eye')) {
      return { topCategory: 'Makeup', subCategory: 'Sets' };
    } else if (combined.includes('skincare') || combined.includes('serum') || combined.includes('moisturizer')) {
      return { topCategory: 'Skincare', subCategory: 'Serums & Treatments' };
    } else if (combined.includes('fragrance') || combined.includes('perfume')) {
      return { topCategory: 'Fragrance', subCategory: 'Sets' };
    } else if (combined.includes('hair') || combined.includes('shampoo') || combined.includes('conditioner')) {
      return { topCategory: 'Hair', subCategory: 'Treatments' };
    } else if (combined.includes('body') || combined.includes('lotion') || combined.includes('scrub')) {
      return { topCategory: 'Body', subCategory: 'Lotions' };
    }
    // Default to Makeup for sets
    return { topCategory: 'Makeup', subCategory: 'Sets' };
  }

  // Minis - map based on product type (same logic as full-size)
  if (combined.includes('mini') || combined.includes('travel size') || combined.includes('travel-size')) {
    // Use the same detection logic but keep the mini flag
    // The category will be determined by the product type
  }

  // Default fallback - try to categorize based on common words
  if (combined.includes('beauty') || combined.includes('cosmetic')) {
    return { topCategory: 'Makeup', subCategory: 'Complexion/Face' };
  }

  return { topCategory: 'Skincare', subCategory: 'Serums & Treatments' };
};

// Parse price string to number
const parsePrice = (priceStr: string): { basePrice: number; priceRange?: { min: number; max: number } } => {
  if (!priceStr) return { basePrice: 0 };
  
  // Remove $ and commas
  const clean = priceStr.replace(/[$,]/g, '').trim();
  
  // Check for price range
  if (clean.includes(' - ')) {
    const [minStr, maxStr] = clean.split(' - ');
    const min = parseFloat(minStr) || 0;
    const max = parseFloat(maxStr) || 0;
    return { basePrice: min, priceRange: { min, max } };
  }
  
  const price = parseFloat(clean) || 0;
  return { basePrice: price };
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Transform CSV row to Product
export const transformCSVRow = (row: string[]): Product | null => {
  if (row.length < 6) return null;
  
  // CSV structure: [css, imageUrl, brand, title, reviewCount, price, ...flags]
  const [, imageUrl, brand, title, reviewCountStr, priceStr, ...flags] = row;
  
  if (!brand || !title || !imageUrl) return null;
  
  const flagsList = flags.filter(f => f && f.trim()).map(f => f.trim());
  const { topCategory, subCategory } = detectCategory(brand, title, flagsList);
  const { basePrice, priceRange } = parsePrice(priceStr || '0');
  const displayPrice = basePrice + 10;
  const displayPriceRange = priceRange ? {
    min: priceRange.min + 10,
    max: priceRange.max + 10
  } : undefined;
  
  // Parse review count
  let reviewCount: number | undefined;
  if (reviewCountStr) {
    const clean = reviewCountStr.replace(/[Kk]/g, '').trim();
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      reviewCount = reviewCountStr.toLowerCase().includes('k') ? Math.round(num * 1000) : num;
    }
  }
  
  const slug = generateSlug(title);
  
  return {
    id: slug,
    brand: brand.trim(),
    title: title.trim(),
    price: displayPrice,
    priceRange: displayPriceRange,
    image: imageUrl || '',
    imageUrl: imageUrl || undefined,
    badge: flagsList.find(f => ['New', 'Limited Edition', 'Online Only', 'Clean'].includes(f)),
    rating: undefined, // Will be inferred or placeholder
    reviewCount,
    sponsored: flagsList.includes('Sponsored'),
    topCategory,
    subCategory,
    flags: flagsList,
    basePrice,
    displayPrice,
    slug
  };
};

// Sample product data from CSV (first few rows)
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'power-mist-hydrating-hand-sanitizer',
    brand: 'Touchland',
    title: 'Power Mist Hydrating Hand Sanitizer',
    price: 22.00,
    image: 'https://www.sephora.com/productimages/sku/s2925006-main-zoom.jpg?imwidth=175',
    topCategory: 'Body',
    subCategory: 'Mists',
    flags: ['New'],
    basePrice: 12.00,
    displayPrice: 22.00,
    slug: 'power-mist-hydrating-hand-sanitizer',
    reviewCount: 2600
  },
  {
    id: 'mini-major-headlines-double-take-creme-powder-blush-duo',
    brand: 'PATRICK TA',
    title: 'Mini Major Headlines Double-Take Crème & Powder Blush Duo',
    price: 35.00,
    image: 'https://www.sephora.com/productimages/sku/s2926020-main-zoom.jpg?imwidth=175',
    topCategory: 'Makeup',
    subCategory: 'Complexion/Face',
    flags: ['New'],
    basePrice: 25.00,
    displayPrice: 35.00,
    slug: 'mini-major-headlines-double-take-creme-powder-blush-duo',
    reviewCount: 47
  }
];

// Get all categories structure - returns only the 5 core categories with imageMenuBlocks
export const getCategoryStructure = (): CategoryStructure[] => {
  return Object.entries(CATEGORY_MAPPINGS).map(([topCategory, data]) => {
    return {
      topCategory: topCategory as TopCategory,
      subCategories: data.subCategories,
      imageMenuBlocks: data.imageMenuBlocks
    };
  });
};

// Get products by category
export const getProductsByCategory = (products: Product[], topCategory?: string, subCategory?: string): Product[] => {
  if (!topCategory) return products;
  
  // Normalize category name (handle slug format)
  const normalizedTop = topCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let filtered = products.filter(p => p.topCategory === normalizedTop);
  
  if (subCategory) {
    const normalizedSub = subCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    filtered = filtered.filter(p => p.subCategory === normalizedSub);
  }
  
  return filtered;
};

// Global products cache - loaded from CSV
let ALL_PRODUCTS: Product[] = [];
let PRODUCTS_LOADED = false;

// Load all products from CSV
export const loadAllProducts = async (): Promise<Product[]> => {
  if (PRODUCTS_LOADED) return ALL_PRODUCTS;
  
  try {
    const { loadProductsFromFile } = await import('../utils/csvLoader');
    ALL_PRODUCTS = await loadProductsFromFile();
    PRODUCTS_LOADED = true;
    return ALL_PRODUCTS;
  } catch (error) {
    console.error('[ProductData] Error loading products:', error);
    return SAMPLE_PRODUCTS; // Fallback to sample
  }
};

// Get all products (lazy loaded)
export const getAllProducts = (): Product[] => {
  return ALL_PRODUCTS.length > 0 ? ALL_PRODUCTS : SAMPLE_PRODUCTS;
};
