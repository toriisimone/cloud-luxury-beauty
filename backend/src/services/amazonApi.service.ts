import crypto from 'crypto';
import { createHash, createHmac } from 'crypto';
import { config } from '../config/env';
import { logger } from '../config/logger';

interface AmazonProduct {
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

interface AmazonSearchResponse {
  products: AmazonProduct[];
  totalResults: number;
}

// Cache for products with timestamp
let productCache: {
  products: AmazonProduct[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate AWS Signature Version 4 for Amazon Product Advertising API
 */
function generateSignature(
  method: string,
  uri: string,
  queryString: string,
  payload: string,
  timestamp: string
): string {
  const algorithm = 'AWS4-HMAC-SHA256';
  const service = 'ProductAdvertisingAPI';
  const region = config.AMAZON_REGION;

  // Create canonical request
  const canonicalHeaders = `host:webservices.amazon.com\nx-amz-date:${timestamp}\n`;
  const signedHeaders = 'host;x-amz-date';
  const payloadHash = createHash('sha256').update(payload).digest('hex');
  const canonicalRequest = `${method}\n${uri}\n${queryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // Create string to sign
  const dateStamp = timestamp.substring(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${canonicalRequestHash}`;

  // Calculate signature
  const kDate = createHmac('sha256', `AWS4${config.AMAZON_SECRET_KEY}`).update(dateStamp).digest();
  const kRegion = createHmac('sha256', kDate).update(region).digest();
  const kService = createHmac('sha256', kRegion).update(service).digest();
  const kSigning = createHmac('sha256', kService).update('aws4_request').digest();
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return signature;
}

/**
 * Search Amazon products using Product Advertising API
 * Note: This is a simplified implementation. For production, consider using the official SDK
 */
async function searchAmazonProducts(
  keywords: string,
  itemCount: number = 10,
  itemPage: number = 1
): Promise<AmazonSearchResponse> {
  try {
    const endpoint = 'webservices.amazon.com';
    const uri = '/paapi5/searchitems';
    const method = 'POST';
    const service = 'ProductAdvertisingAPI';
    const region = config.AMAZON_REGION;
    const now = new Date();
    const dateStamp = now.toISOString().substring(0, 10).replace(/-/g, '');
    const timestamp = `${dateStamp}T${now.toISOString().substring(11, 19).replace(/:/g, '')}Z`;

    // Request payload
    const payload = JSON.stringify({
      PartnerType: 'Associates',
      PartnerTag: config.AMAZON_ASSOCIATE_TAG,
      Marketplace: 'www.amazon.com',
      Keywords: keywords,
      SearchIndex: 'Beauty',
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Classifications',
        'ItemInfo.ContentInfo',
        'ItemInfo.ContentRating',
        'ItemInfo.ExternalIds',
        'ItemInfo.Features',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'ItemInfo.TradeInInfo',
        'Offers.Listings.Price',
        'Offers.Summaries.HighestPrice',
        'Offers.Summaries.LowestPrice',
        'CustomerReviews.StarRating',
        'CustomerReviews.Count',
      ],
      ItemCount: itemCount,
      ItemPage: itemPage,
    });

    // Create authorization header
    const queryString = '';
    const signature = generateSignature(method, uri, queryString, payload, timestamp);
    const credentialScope = `${timestamp.substring(0, 8)}/${region}/${service}/aws4_request`;
    const authorization = `AWS4-HMAC-SHA256 Credential=${config.AMAZON_ACCESS_KEY}/${credentialScope}, SignedHeaders=host;x-amz-date, Signature=${signature}`;

    // Make API request
    const response = await fetch(`https://${endpoint}${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Date': timestamp,
        'Authorization': authorization,
        'Host': endpoint,
      },
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Amazon API error:', errorText);
      throw new Error(`Amazon API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as any;

    // Parse response
    const products: AmazonProduct[] = [];
    if (data?.SearchResult?.Items) {
      const items = data.SearchResult.Items as any[];
      for (const item of items) {
        try {
          const asin = item.ASIN;
          const title = item.ItemInfo?.Title?.DisplayValue || 'Unknown Product';
          const imageUrl = item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL || '';
          const price = parseFloat(
            item.Offers?.Listings?.[0]?.Price?.Amount || 
            item.Offers?.Summaries?.[0]?.LowestPrice?.Amount || 
            '0'
          ) / 100; // Amazon returns prices in cents
          const rating = parseFloat(item.CustomerReviews?.StarRating?.Value || '0');
          const reviewCount = parseInt(item.CustomerReviews?.Count || '0', 10);

          // Generate affiliate URL
          const affiliateUrl = `https://www.amazon.com/dp/${asin}?tag=${config.AMAZON_ASSOCIATE_TAG}`;

          // Extract size if available
          let size: string | undefined;
          if (item.ItemInfo?.ProductInfo?.Size) {
            size = item.ItemInfo.ProductInfo.Size.DisplayValue;
          }

          // Determine tags
          const tags: string[] = [];
          if (item.ItemInfo?.Features?.DisplayValues?.length > 0) {
            const features = item.ItemInfo.Features.DisplayValues.join(' ').toLowerCase();
            if (features.includes('best seller') || features.includes('bestseller')) {
              tags.push('Best-seller');
            }
            if (features.includes('award') || features.includes('winner')) {
              tags.push('Award Winner');
            }
          }
          // Mark as "New" if review count is low (less than 50)
          if (reviewCount < 50 && reviewCount > 0) {
            tags.push('New');
          }

          products.push({
            asin,
            title,
            price,
            imageUrl,
            rating: rating > 0 ? rating : undefined,
            reviewCount: reviewCount > 0 ? reviewCount : undefined,
            size,
            tags: tags.length > 0 ? tags : undefined,
            affiliateUrl,
          });
        } catch (itemError) {
          logger.error('Error parsing Amazon product item:', itemError);
          continue;
        }
      }
    }

    return {
      products,
      totalResults: (data as any)?.SearchResult?.TotalResultCount || products.length,
    };
  } catch (error: any) {
    logger.error('Amazon API search error:', error);
    throw error;
  }
}

/**
 * Fetch skincare products from Amazon
 * Uses caching to avoid hitting API rate limits
 */
export async function getSkincareProducts(): Promise<AmazonProduct[]> {
  // Check cache first
  if (productCache && Date.now() - productCache.timestamp < CACHE_DURATION) {
    logger.info('Returning cached Amazon products');
    return productCache.products;
  }

  logger.info('Fetching fresh Amazon skincare products...');

  // Amazon API allows max 10 items per request, so we need multiple requests
  const allProducts: AmazonProduct[] = [];
  const keywords = ['skincare', 'face cream', 'serum', 'moisturizer', 'cleanser', 'toner', 'sunscreen', 'face mask', 'eye cream', 'anti-aging'];
  
  try {
    // Fetch products in batches
    for (let i = 0; i < 10 && allProducts.length < 100; i++) {
      const keyword = keywords[i % keywords.length];
      const itemPage = Math.floor(i / keywords.length) + 1;
      
      try {
        const result = await searchAmazonProducts(keyword, 10, itemPage);
        allProducts.push(...result.products);
        
        // Avoid rate limiting
        if (i < 9) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
        }
      } catch (error: any) {
        logger.error(`Error fetching batch ${i + 1}:`, error);
        // Continue with next batch even if one fails
      }
    }

    // Remove duplicates by ASIN
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.asin, p])).values()
    ).slice(0, 100); // Limit to 100 products

    // Update cache
    productCache = {
      products: uniqueProducts,
      timestamp: Date.now(),
    };

    logger.info(`Fetched ${uniqueProducts.length} unique Amazon skincare products`);
    return uniqueProducts;
  } catch (error: any) {
    logger.error('Error fetching Amazon products:', error);
    
    // Return cached products if available, even if expired
    if (productCache) {
      logger.warn('Returning expired cache due to API error');
      return productCache.products;
    }
    
    throw error;
  }
}

/**
 * Manually refresh the product cache
 */
export async function refreshProductCache(): Promise<void> {
  productCache = null;
  await getSkincareProducts();
}
