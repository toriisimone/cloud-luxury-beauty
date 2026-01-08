import axiosClient from './axiosClient';

export interface AmazonProduct {
  asin: string;
  title: string;
  price: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  size?: string;
  tags?: string[];
  affiliateUrl: string;
}

export interface AmazonProductsResponse {
  products: AmazonProduct[];
  count: number;
  source: string;
  error?: string; // Optional error message if API call fails
}

/**
 * Get Amazon skincare products
 * Includes timeout to prevent hanging
 */
export const getAmazonSkincareProducts = async (): Promise<AmazonProductsResponse> => {
  try {
    // Set a timeout of 10 seconds for Amazon API calls
    const timeoutPromise = new Promise<AmazonProductsResponse>((_, reject) => {
      setTimeout(() => reject(new Error('Amazon API request timeout')), 10000);
    });
    
    const apiPromise = axiosClient.get<AmazonProductsResponse>('/amazon/skincare').then(res => res.data);
    
    return await Promise.race([apiPromise, timeoutPromise]);
  } catch (error: any) {
    console.error('[AMAZON API] Error fetching Amazon products:', error);
    // Return empty response instead of throwing - let the caller handle fallback
    return {
      products: [],
      count: 0,
      source: 'amazon',
      error: error.message || 'Failed to fetch Amazon products',
    };
  }
};

/**
 * Refresh Amazon products cache
 */
export const refreshAmazonProducts = async (): Promise<AmazonProductsResponse> => {
  const response = await axiosClient.post<AmazonProductsResponse>('/amazon/refresh');
  return response.data;
};
