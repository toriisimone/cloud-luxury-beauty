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

  logger.info(`[AMAZON API] Generating signature for region: ${region}`);

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

  // Calculate signature using AWS Signature Version 4
  // Step 1: kDate = HMAC_SHA256("AWS4" + SecretKey, DateStamp)
  const kDate = createHmac('sha256', `AWS4${config.AMAZON_SECRET_KEY}`).update(dateStamp).digest();
  // Step 2: kRegion = HMAC_SHA256(kDate, Region)
  const kRegion = createHmac('sha256', kDate).update(region).digest();
  // Step 3: kService = HMAC_SHA256(kRegion, Service)
  const kService = createHmac('sha256', kRegion).update(service).digest();
  // Step 4: kSigning = HMAC_SHA256(kService, "aws4_request")
  const kSigning = createHmac('sha256', kService).update('aws4_request').digest();
  // Step 5: signature = HMAC_SHA256(kSigning, StringToSign)
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  
  logger.info(`[AMAZON API] Signature generated: ${signature.substring(0, 16)}...`);

  return signature;
}

/**
 * Search Amazon products using Product Advertising API
 */
async function searchAmazonProducts(
  keywords: string,
  itemCount: number = 10,
  itemPage: number = 1
): Promise<AmazonSearchResponse> {
  try {
    // Verify credentials are set
    if (!config.AMAZON_ACCESS_KEY || !config.AMAZON_SECRET_KEY || !config.AMAZON_ASSOCIATE_TAG) {
      const errorMsg = 'Amazon API credentials not configured. Missing: ' + 
        (!config.AMAZON_ACCESS_KEY ? 'AMAZON_ACCESS_KEY ' : '') +
        (!config.AMAZON_SECRET_KEY ? 'AMAZON_SECRET_KEY ' : '') +
        (!config.AMAZON_ASSOCIATE_TAG ? 'AMAZON_ASSOCIATE_TAG' : '');
      logger.error(`[AMAZON API] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    logger.info(`[AMAZON API] Starting search for keywords: "${keywords}", itemCount: ${itemCount}, itemPage: ${itemPage}`);
    logger.info(`[AMAZON API] Using Access Key: ${config.AMAZON_ACCESS_KEY.substring(0, 10)}...`);
    logger.info(`[AMAZON API] Using Associate Tag: ${config.AMAZON_ASSOCIATE_TAG}`);
    logger.info(`[AMAZON API] Using Region: ${config.AMAZON_REGION}`);

    const endpoint = 'webservices.amazon.com';
    const uri = '/paapi5/searchitems';
    const method = 'POST';
    const service = 'ProductAdvertisingAPI';
    const region = config.AMAZON_REGION;
    
    // Generate timestamp in correct format for AWS Signature V4
    const now = new Date();
    const dateStamp = now.toISOString().substring(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStamp = now.toISOString().substring(11, 19).replace(/:/g, ''); // HHMMSS
    const timestamp = `${dateStamp}T${timeStamp}Z`; // YYYYMMDDTHHMMSSZ

    logger.info(`[AMAZON API] Timestamp: ${timestamp}`);

    // Request payload - EXACT format required by PA-API 5.0
    // Verify Associate Tag is exactly as provided
    const associateTag = config.AMAZON_ASSOCIATE_TAG.trim();
    if (associateTag !== 'victoria0cdb-20') {
      logger.warn(`[AMAZON API] Associate Tag mismatch! Expected: victoria0cdb-20, Got: "${associateTag}"`);
    }
    logger.info(`[AMAZON API] Using Associate Tag: "${associateTag}"`);
    
    const payload = JSON.stringify({
      PartnerType: 'Associates',
      PartnerTag: associateTag, // Use trimmed value
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

    logger.info(`[AMAZON API] Request payload: ${payload.substring(0, 200)}...`);
    logger.info(`[AMAZON API] Full payload: ${payload}`);

    // Create authorization header
    const queryString = '';
    const signature = generateSignature(method, uri, queryString, payload, timestamp);
    const credentialScope = `${timestamp.substring(0, 8)}/${region}/${service}/aws4_request`;
    const authorization = `AWS4-HMAC-SHA256 Credential=${config.AMAZON_ACCESS_KEY}/${credentialScope}, SignedHeaders=host;x-amz-date, Signature=${signature}`;

    logger.info(`[AMAZON API] Authorization header created (length: ${authorization.length})`);
    logger.info(`[AMAZON API] Authorization (first 100 chars): ${authorization.substring(0, 100)}...`);
    logger.info(`[AMAZON API] Making request to: https://${endpoint}${uri}`);
    logger.info(`[AMAZON API] Request method: ${method}`);
    logger.info(`[AMAZON API] Request URI: ${uri}`);
    logger.info(`[AMAZON API] Request body length: ${payload.length} bytes`);

    // Make API request
    // Note: Do NOT include 'Host' header - it's automatically set by fetch
    const response = await fetch(`https://${endpoint}${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Date': timestamp,
        'Authorization': authorization,
      },
      body: payload,
    });

    logger.info(`[AMAZON API] Response status: ${response.status} ${response.statusText}`);
    logger.info(`[AMAZON API] Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries())));

    const responseText = await response.text();
    logger.info(`[AMAZON API] ========== RAW RESPONSE START ==========`);
    logger.info(`[AMAZON API] RAW RESPONSE (full length): ${responseText.length} characters`);
    logger.info(`[AMAZON API] RAW RESPONSE (first 1000 chars): ${responseText.substring(0, 1000)}`);
    if (responseText.length > 1000) {
      logger.info(`[AMAZON API] RAW RESPONSE (last 500 chars): ${responseText.substring(responseText.length - 500)}`);
    }
    logger.info(`[AMAZON API] ========== RAW RESPONSE END ==========`);

    if (!response.ok) {
      logger.error(`[AMAZON API] Error response: ${responseText}`);
      
      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        logger.error(`[AMAZON API] Parsed error:`, JSON.stringify(errorData, null, 2));
        
        if (errorData.__type) {
          logger.error(`[AMAZON API] Error type: ${errorData.__type}`);
        }
        if (errorData.message) {
          logger.error(`[AMAZON API] Error message: ${errorData.message}`);
        }
        if (errorData.Errors) {
          logger.error(`[AMAZON API] Errors array:`, JSON.stringify(errorData.Errors, null, 2));
        }
      } catch (parseError) {
        logger.error(`[AMAZON API] Could not parse error response as JSON`);
      }
      
      throw new Error(`Amazon API error: ${response.status} ${response.statusText} - ${responseText.substring(0, 200)}`);
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
      logger.info(`[AMAZON API] Response parsed successfully`);
      logger.info(`[AMAZON API] Response keys: ${Object.keys(data).join(', ')}`);
      
      if (data.Errors) {
        logger.error(`[AMAZON API] Response contains Errors:`, JSON.stringify(data.Errors, null, 2));
        throw new Error(`Amazon API returned errors: ${JSON.stringify(data.Errors)}`);
      }
      
      if (data.SearchResult) {
        logger.info(`[AMAZON API] SearchResult found`);
        logger.info(`[AMAZON API] TotalResultCount: ${data.SearchResult.TotalResultCount || 'N/A'}`);
        logger.info(`[AMAZON API] Items count: ${data.SearchResult.Items?.length || 0}`);
        if (data.SearchResult.Items && data.SearchResult.Items.length > 0) {
          logger.info(`[AMAZON API] First item ASIN: ${data.SearchResult.Items[0].ASIN}`);
          logger.info(`[AMAZON API] First item title: ${data.SearchResult.Items[0].ItemInfo?.Title?.DisplayValue || 'N/A'}`);
        }
      } else {
        logger.warn(`[AMAZON API] No SearchResult in response`);
        logger.warn(`[AMAZON API] Response keys: ${Object.keys(data).join(', ')}`);
        logger.warn(`[AMAZON API] Full response structure:`, JSON.stringify(data, null, 2));
      }
    } catch (parseError: any) {
      logger.error(`[AMAZON API] Failed to parse response as JSON:`, parseError.message);
      logger.error(`[AMAZON API] Response text: ${responseText}`);
      throw new Error(`Failed to parse Amazon API response: ${parseError.message}`);
    }

    // Parse response
    const products: AmazonProduct[] = [];
    if (data?.SearchResult?.Items) {
      const items = data.SearchResult.Items as any[];
      logger.info(`[AMAZON API] Processing ${items.length} items`);
      
      for (const item of items) {
        try {
          const asin = item.ASIN;
          if (!asin) {
            logger.warn(`[AMAZON API] Item missing ASIN, skipping`);
            continue;
          }
          
          const title = item.ItemInfo?.Title?.DisplayValue || 'Unknown Product';
          const imageUrl = item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL || '';
          const priceStr = item.Offers?.Listings?.[0]?.Price?.Amount || 
                          item.Offers?.Summaries?.[0]?.LowestPrice?.Amount || 
                          '0';
          const price = parseFloat(priceStr) / 100; // Amazon returns prices in cents
          const rating = parseFloat(item.CustomerReviews?.StarRating?.Value || '0');
          const reviewCount = parseInt(item.CustomerReviews?.Count || '0', 10);

          // Generate affiliate URL with EXACT tag
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
          
          logger.debug(`[AMAZON API] Parsed product: ${asin} - ${title.substring(0, 50)}...`);
        } catch (itemError: any) {
          logger.error(`[AMAZON API] Error parsing product item:`, itemError);
          continue;
        }
      }
    } else {
      logger.warn(`[AMAZON API] No items found in SearchResult`);
      if (data) {
        logger.warn(`[AMAZON API] Response structure:`, JSON.stringify(data, null, 2).substring(0, 2000));
      }
    }

    logger.info(`[AMAZON API] Successfully parsed ${products.length} products from ${keywords} search`);

    return {
      products,
      totalResults: (data as any)?.SearchResult?.TotalResultCount || products.length,
    };
  } catch (error: any) {
    logger.error(`[AMAZON API] Search error for keywords "${keywords}":`, error);
    logger.error(`[AMAZON API] Error stack:`, error.stack);
    throw error;
  }
}

/**
 * Fetch skincare products from Amazon
 * Uses caching to avoid hitting API rate limits
 */
export async function getSkincareProducts(): Promise<AmazonProduct[]> {
  // Check credentials first
  if (!config.AMAZON_ACCESS_KEY || !config.AMAZON_SECRET_KEY || !config.AMAZON_ASSOCIATE_TAG) {
    logger.warn('[AMAZON API] Credentials not configured, returning empty array');
    return [];
  }

  // Check cache first
  if (productCache && Date.now() - productCache.timestamp < CACHE_DURATION) {
    logger.info(`[AMAZON API] Returning ${productCache.products.length} cached products`);
    return productCache.products;
  }

  logger.info('[AMAZON API] Fetching fresh Amazon skincare products...');
  logger.info(`[AMAZON API] Access Key: ${config.AMAZON_ACCESS_KEY.substring(0, 10)}...`);
  logger.info(`[AMAZON API] Associate Tag: ${config.AMAZON_ASSOCIATE_TAG}`);
  logger.info(`[AMAZON API] Region: ${config.AMAZON_REGION}`);

  // Amazon API allows max 10 items per request, so we need multiple requests
  // SKINCARE-ONLY keywords - comprehensive list for maximum product coverage
  const keywords = [
    'skincare',
    'face cream',
    'serum',
    'moisturizer',
    'cleanser',
    'toner',
    'sunscreen',
    'face mask',
    'eye cream',
    'anti-aging',
    'hydrating',
    'brightening',
    'acne treatment',
    'retinol',
    'hyaluronic acid',
    'vitamin c serum',
    'niacinamide',
    'peptide serum',
    'face wash',
    'exfoliant'
  ];
  
  logger.info(`[AMAZON API] Using ${keywords.length} skincare-specific keywords`);
  logger.info(`[AMAZON API] Keywords: ${keywords.join(', ')}`);
  
  // Initialize products array
  const allProducts: AmazonProduct[] = [];
  
  try {
    // Fetch products in batches - use all keywords to get 100+ products
    const totalBatches = Math.min(20, keywords.length * 2); // Up to 20 batches (200 potential products)
    for (let i = 0; i < totalBatches && allProducts.length < 100; i++) {
      const keyword = keywords[i % keywords.length];
      const itemPage = Math.floor(i / keywords.length) + 1;
      
      try {
        logger.info(`[AMAZON API] Fetching batch ${i + 1}/${totalBatches}: keyword="${keyword}", page=${itemPage}`);
        const result = await searchAmazonProducts(keyword, 10, itemPage);
        logger.info(`[AMAZON API] Batch ${i + 1} returned ${result.products.length} products for keyword "${keyword}"`);
        logger.info(`[AMAZON API] TotalResultCount from Amazon: ${result.totalResults}`);
        allProducts.push(...result.products);
        
        // Avoid rate limiting - wait 1.5 seconds between requests
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error: any) {
        logger.error(`[AMAZON API] Error fetching batch ${i + 1}:`, error.message);
        logger.error(`[AMAZON API] Error details:`, error);
        // Continue with next batch even if one fails
      }
    }

    logger.info(`[AMAZON API] ========== FETCH SUMMARY ==========`);
    logger.info(`[AMAZON API] Total products fetched before deduplication: ${allProducts.length}`);
    logger.info(`[AMAZON API] Products by keyword:`, 
      JSON.stringify(keywords.map((k: string) => ({
        keyword: k,
        count: allProducts.filter((p: AmazonProduct) => p.title.toLowerCase().includes(k.toLowerCase())).length
      })))
    );

    // Remove duplicates by ASIN
    const uniqueProducts: AmazonProduct[] = Array.from(
      new Map(allProducts.map((p: AmazonProduct) => [p.asin, p] as [string, AmazonProduct])).values()
    ).slice(0, 100) as AmazonProduct[]; // Limit to 100 products

    logger.info(`[AMAZON API] Unique SKINCARE products after deduplication: ${uniqueProducts.length}`);
    logger.info(`[AMAZON API] ========== END FETCH SUMMARY ==========`);

    // Update cache
    productCache = {
      products: uniqueProducts,
      timestamp: Date.now(),
    };

    logger.info(`[AMAZON API] Successfully fetched and cached ${uniqueProducts.length} unique Amazon skincare products`);
    return uniqueProducts;
  } catch (error: any) {
    logger.error('[AMAZON API] Error fetching Amazon products:', error);
    logger.error('[AMAZON API] Error stack:', error.stack);
    
    // Return cached products if available, even if expired
    if (productCache && productCache.products.length > 0) {
      logger.warn(`[AMAZON API] Returning ${productCache.products.length} expired cached products due to API error`);
      return productCache.products;
    }
    
    // If no cache and API fails, return empty array (frontend will fallback to regular products)
    logger.warn('[AMAZON API] No cache available and API failed, returning empty array');
    return [];
  }
}

/**
 * Manually refresh the product cache
 */
export async function refreshProductCache(): Promise<void> {
  logger.info('[AMAZON API] Manually refreshing product cache...');
  productCache = null;
  await getSkincareProducts();
}
