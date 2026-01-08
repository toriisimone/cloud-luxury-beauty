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
 */
export const getAmazonSkincareProducts = async (): Promise<AmazonProductsResponse> => {
  const response = await axiosClient.get<AmazonProductsResponse>('/amazon/skincare');
  return response.data;
};

/**
 * Refresh Amazon products cache
 */
export const refreshAmazonProducts = async (): Promise<AmazonProductsResponse> => {
  const response = await axiosClient.post<AmazonProductsResponse>('/amazon/refresh');
  return response.data;
};
