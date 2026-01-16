// Image path utilities and AI prompt definitions

export interface ImagePrompt {
  prompt: string;
  style: string;
  aspectRatio: string;
}

/**
 * Get product image path
 * Format: /assets/images/products/{topCategory}/{subCategory}/{product-slug}.jpg
 */
export const getProductImagePath = (
  topCategory: string,
  subCategory: string,
  productSlug: string
): string => {
  const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
  const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
  return `/assets/images/products/${topSlug}/${subSlug}/${productSlug}.jpg`;
};

/**
 * Get category menu tile image path
 * Format: /mega-images/{topCategory}/tile.jpg
 */
export const getMenuTileImagePath = (topCategory: string): string => {
  const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
  return `/mega-images/${topSlug}/tile.png`;
};

/**
 * Get category menu banner image path
 * Format: /mega-images/{topCategory}/banner.jpg
 */
export const getMenuBannerImagePath = (topCategory: string): string => {
  const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
  return `/mega-images/${topSlug}/banner.png`;
};

/**
 * Get ad image path
 * Format: /assets/images/ads/{topCategory}/{subCategory}/ad-{index}.jpg
 * Or: /assets/images/ads/{topCategory}/ad-{index}.jpg (if no subcategory)
 */
export const getAdImagePath = (
  topCategory: string,
  subCategory: string | undefined,
  index: number
): string => {
  const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
  if (subCategory) {
    const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
    return `/assets/images/ads/${topSlug}/${subSlug}/ad-${index}.jpg`;
  }
  return `/assets/images/ads/${topSlug}/ad-${index}.jpg`;
};

/**
 * Generate AI prompt for product image
 */
export const getProductImagePrompt = (
  brand: string,
  title: string,
  category: string,
  subCategory: string
): ImagePrompt => {
  // Extract key descriptors from title
  const descriptors = title.toLowerCase();
  const isSerum = descriptors.includes('serum');
  const isCream = descriptors.includes('cream') || descriptors.includes('moisturizer');
  const isToner = descriptors.includes('toner');
  const isCleanser = descriptors.includes('cleanser') || descriptors.includes('wash');
  const isLip = descriptors.includes('lip');
  const isFoundation = descriptors.includes('foundation');
  const isBlush = descriptors.includes('blush');
  const isMascara = descriptors.includes('mascara');

  let productType = 'beauty product';
  let containerType = 'bottle';
  let finish = 'minimalist';

  if (isSerum || isToner) {
    productType = 'skincare serum';
    containerType = 'frosted glass dropper bottle';
  } else if (isCream) {
    productType = 'skincare cream';
    containerType = 'jar or tube';
  } else if (isCleanser) {
    productType = 'facial cleanser';
    containerType = 'pump bottle';
  } else if (isLip) {
    productType = 'lip product';
    containerType = 'tube or compact';
  } else if (isFoundation) {
    productType = 'foundation';
    containerType = 'bottle or compact';
  } else if (isBlush) {
    productType = 'blush';
    containerType = 'compact';
  } else if (isMascara) {
    productType = 'mascara';
    containerType = 'tube';
  }

  const prompt = `Luxury ${productType} in ${containerType}, ${brand} brand aesthetic, clean editorial product photography, soft gradient background in neutral beige and cream tones, professional studio lighting, minimalist composition, high-end beauty product shot, white background option, product centered, premium quality`;

  return {
    prompt,
    style: 'editorial, minimalist, luxury beauty, clean product photography',
    aspectRatio: '1:1'
  };
};

/**
 * Generate AI prompt for category menu tile
 */
export const getMenuTileImagePrompt = (category: string, subCategory?: string): ImagePrompt => {
  const categoryLower = category.toLowerCase();
  let theme = 'beauty products';

  if (categoryLower.includes('skincare')) {
    theme = 'skincare products arranged elegantly, serums, creams, bottles';
  } else if (categoryLower.includes('makeup')) {
    theme = 'makeup products, lipsticks, foundations, compacts';
  } else if (categoryLower.includes('hair')) {
    theme = 'hair care products, shampoos, conditioners, styling tools';
  } else if (categoryLower.includes('fragrance')) {
    theme = 'perfume bottles, elegant fragrance collection';
  } else if (categoryLower.includes('body')) {
    theme = 'body care products, lotions, creams, mists';
  }

  const prompt = `${theme}, ${subCategory || category} category, clean editorial style, soft pastel background, luxury beauty aesthetic, minimalist composition, square format, professional product photography`;

  return {
    prompt,
    style: 'editorial, category showcase, luxury beauty',
    aspectRatio: '1:1'
  };
};

/**
 * Generate AI prompt for ad banner
 */
export const getAdBannerImagePrompt = (
  category: string,
  subCategory?: string,
  headline?: string
): ImagePrompt => {
  const categoryLower = category.toLowerCase();
  let theme = 'beauty products';

  if (categoryLower.includes('skincare')) {
    theme = 'skincare routine, glowing skin, hydration, serums and creams';
  } else if (categoryLower.includes('makeup')) {
    theme = 'makeup collection, glamorous looks, lip products, eyeshadows';
  } else if (categoryLower.includes('hair')) {
    theme = 'healthy hair, styling products, hair care essentials';
  }

  const prompt = `${theme}, ${headline || `${category} essentials`}, promotional banner style, vibrant colors, collage of products, luxury beauty aesthetic, horizontal format, eye-catching composition, professional beauty photography`;

  return {
    prompt,
    style: 'promotional banner, beauty collage, luxury aesthetic',
    aspectRatio: '16:9'
  };
};
