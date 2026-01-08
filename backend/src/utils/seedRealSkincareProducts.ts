import prisma from '../config/database';
import { logger } from '../config/logger';
import { config } from '../config/env';
import crypto from 'crypto';

interface ProductData {
  asin: string;
  title: string;
  salePrice: number;
  originalPrice: number;
  discountPercent: number;
}

/**
 * Seed 82 real Amazon skincare products
 */
export async function seedRealSkincareProducts(): Promise<boolean> {
  try {
    logger.info('[SEED REAL SKINCARE] ========== STARTING SEED ==========');
    console.log('[SEED REAL SKINCARE] ========== STARTING SEED ==========');

    // 1. Create or get Skincare category
    let skincareCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: 'Skincare',
          mode: 'insensitive',
        },
      },
    });

    if (!skincareCategory) {
      logger.info('[SEED REAL SKINCARE] Creating Skincare category...');
      skincareCategory = await prisma.category.create({
        data: {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Premium skincare products from Amazon',
        },
      });
      logger.info(`[SEED REAL SKINCARE] ✅ Created category: ${skincareCategory.id}`);
    } else {
      logger.info(`[SEED REAL SKINCARE] ✅ Category exists: ${skincareCategory.id}`);
    }

    // 2. Parse all 82 products from the list
    const productsData: ProductData[] = [
      { asin: 'B0G4QVNGSR', title: 'Grass-Fed Beef Tallow for Skin', salePrice: 10.00, originalPrice: 19.99, discountPercent: 50 },
      { asin: 'B0D1XQGXG8', title: '10 Pack Hydrating Sheet Mask', salePrice: 4.99, originalPrice: 9.99, discountPercent: 50 },
      { asin: 'B0F43M9PXF', title: 'AH-8 Firming Neck Cream', salePrice: 3.99, originalPrice: 7.99, discountPercent: 50 },
      { asin: 'B0G2PLRGW5', title: 'Body Firming Oil', salePrice: 7.99, originalPrice: 25.99, discountPercent: 69 },
      { asin: 'B0G292W74Y', title: 'Alcura Nerve Cream', salePrice: 9.00, originalPrice: 17.99, discountPercent: 50 },
      { asin: 'B0G3N7LWX3', title: 'Breast Enhancement Patch', salePrice: 8.42, originalPrice: 16.83, discountPercent: 50 },
      { asin: 'B0FT8DWLXN', title: 'Salmon DNA PDRN Serum', salePrice: 15.00, originalPrice: 29.99, discountPercent: 50 },
      { asin: 'B0G29G5MXV', title: '5-in-1 Vitamin C Serum', salePrice: 5.99, originalPrice: 9.99, discountPercent: 40 },
      { asin: 'B0BTMCH534', title: 'Revolution Balm Glow', salePrice: 3.25, originalPrice: 12.00, discountPercent: 73 },
      { asin: 'B0FYF8CX7R', title: 'Salmon DNA PDRN Anti-Aging Serum', salePrice: 9.49, originalPrice: 29.99, discountPercent: 68 },
      { asin: 'B0G2S1M266', title: 'Orange Exfoliating Gel', salePrice: 6.49, originalPrice: 12.99, discountPercent: 50 },
      { asin: 'B0F9XYWFZ8', title: 'PDRN Pink Collagen Capsule Cream', salePrice: 9.85, originalPrice: 16.99, discountPercent: 42 },
      { asin: 'B094DGZV56', title: 'Beaupretty Mini Cosmetic Spatulas', salePrice: 4.81, originalPrice: 8.01, discountPercent: 40 },
      { asin: 'B0FRFNFGW7', title: 'Salmon DNA PDRN Facial Serum', salePrice: 25.51, originalPrice: 43.99, discountPercent: 42 },
      { asin: 'B0F6T9KBWM', title: 'Advanced Retinol Firming Serum Stick', salePrice: 7.99, originalPrice: 15.99, discountPercent: 50 },
      { asin: 'B08HJKQP7X', title: 'Cetaphil Sheer Mineral Sunscreen', salePrice: 7.44, originalPrice: 10.99, discountPercent: 32 },
      { asin: 'B0CSM3Q54Z', title: 'Rejuvenating Facial Night Cream', salePrice: 13.33, originalPrice: 22.22, discountPercent: 40 },
      { asin: 'B0F9WXBT5D', title: 'Centella Sunscreen', salePrice: 7.99, originalPrice: 15.98, discountPercent: 50 },
      { asin: 'B0CW61QCPZ', title: 'Niacinamide 5% Pore Refining Serum', salePrice: 11.99, originalPrice: 19.99, discountPercent: 40 },
      { asin: 'B0FHJPQ44T', title: 'Natural Amor Vanilla Rose Body Butter', salePrice: 7.49, originalPrice: 14.99, discountPercent: 50 },
      { asin: 'B0G393G8XL', title: 'Breast Enhancement Cream', salePrice: 8.89, originalPrice: 17.77, discountPercent: 50 },
      { asin: 'B0FPQ3Z16S', title: 'Medicube Hyaluronic Acid Jelly Cream', salePrice: 14.90, originalPrice: 16.90, discountPercent: 12 },
      { asin: 'B0CPD1JDKF', title: 'eos Cashmere Pre-Shave Scrub', salePrice: 5.00, originalPrice: 8.99, discountPercent: 44 },
      { asin: 'B0CZS7XGVW', title: 'Ice Face Mask', salePrice: 7.99, originalPrice: 15.99, discountPercent: 50 },
      { asin: 'B07FY17L3N', title: 'Irish Spring Bar Soap', salePrice: 16.74, originalPrice: 25.99, discountPercent: 36 },
      { asin: 'B0DJ737LXP', title: 'Deep Collagen Face Mask', salePrice: 9.43, originalPrice: 15.99, discountPercent: 41 },
      { asin: 'B0F386N56J', title: 'New Beef Tallow for Face', salePrice: 11.94, originalPrice: 23.89, discountPercent: 50 },
      { asin: 'B0FLXK5HVL', title: 'CLIO Glazing Milky Essence', salePrice: 16.79, originalPrice: 27.99, discountPercent: 40 },
      { asin: 'B0FND3SWL5', title: 'Rice Exfoliating Ampoule Set', salePrice: 7.99, originalPrice: 15.99, discountPercent: 50 },
      { asin: 'B0FN3J729X', title: '2% Salicylic Acid Serum', salePrice: 9.92, originalPrice: 18.71, discountPercent: 47 },
      { asin: 'B0FFY6F1FK', title: 'Snail Mucin Toning Pads', salePrice: 15.50, originalPrice: 33.88, discountPercent: 54 },
      { asin: 'B0G1Y79CSJ', title: 'AH-8 Firming Neck Cream (Chamomile)', salePrice: 4.94, originalPrice: 9.89, discountPercent: 50 },
      { asin: 'B0FMX8BM4L', title: 'Salmon DNA PDRN Peptide Serum', salePrice: 19.99, originalPrice: 45.99, discountPercent: 57 },
      { asin: 'B0G5WVB8Z3', title: 'Neck Lift Tape', salePrice: 8.66, originalPrice: 17.33, discountPercent: 50 },
      { asin: 'B0CKMY3CS9', title: 'Acne Patches', salePrice: 3.99, originalPrice: 7.99, discountPercent: 50 },
      { asin: 'B0G5YD2MZW', title: 'Hyaluronic Acid Powder', salePrice: 6.49, originalPrice: 12.99, discountPercent: 50 },
      { asin: 'B0DXFCS75L', title: 'Collagen Face Mask', salePrice: 4.99, originalPrice: 9.99, discountPercent: 50 },
      { asin: 'B0F62QBWKN', title: 'Retinol Serum', salePrice: 9.97, originalPrice: 18.82, discountPercent: 47 },
      { asin: 'B0G445XBLQ', title: 'Blue Lagoon GHK-Cu Serum', salePrice: 17.49, originalPrice: 34.98, discountPercent: 50 },
      { asin: 'B0FMK7WDSQ', title: 'Turmeric Vitamin C Clay Mask', salePrice: 4.49, originalPrice: 8.99, discountPercent: 50 },
      { asin: 'B0FJFLK22X', title: 'Retinol B5 Resurfacing Serum', salePrice: 11.00, originalPrice: 21.99, discountPercent: 50 },
      { asin: 'B0FSWKKY67', title: 'Tallow Glow Balm', salePrice: 5.49, originalPrice: 9.99, discountPercent: 45 },
      { asin: 'B0FT71JLYF', title: 'Vitamin C Serum', salePrice: 29.90, originalPrice: 46.00, discountPercent: 35 },
      { asin: 'B0FX7SYL6K', title: 'PDRN Skin Care Set', salePrice: 43.55, originalPrice: 67.00, discountPercent: 35 },
      { asin: 'B08JQF78VV', title: 'BANOBAGI Milk Thistle Repair Cream', salePrice: 18.90, originalPrice: 27.00, discountPercent: 30 },
      { asin: 'B0FR59XDFD', title: 'Beef Tallow for Skin', salePrice: 10.00, originalPrice: 19.99, discountPercent: 50 },
      { asin: 'B0FSWQZL4S', title: 'Fed Beef Tallow Balm', salePrice: 12.50, originalPrice: 24.99, discountPercent: 50 },
      { asin: 'B0FLQ3DCH2', title: 'Medicube Wrapping Mask', salePrice: 16.14, originalPrice: 21.80, discountPercent: 26 },
      { asin: 'B0FHJRHXP7', title: 'HKY Acne Serum', salePrice: 12.50, originalPrice: 24.99, discountPercent: 50 },
      { asin: 'B08R2FSPLL', title: 'Prickly Pear Seed Oil', salePrice: 18.00, originalPrice: 30.00, discountPercent: 40 },
      { asin: 'B0CDF83QRR', title: 'FRCOLOR Facial Roller', salePrice: 5.45, originalPrice: 9.09, discountPercent: 40 },
      { asin: 'B01LZAN652', title: 'CeraVe Skin Renewing Gel Oil', salePrice: 12.99, originalPrice: 25.99, discountPercent: 50 },
      { asin: 'B0F28YLSN8', title: 'Hyaluronic Acid Overnight Mask', salePrice: 5.99, originalPrice: 11.99, discountPercent: 50 },
      { asin: 'B01HOHBS7K', title: 'Neutrogena Hydro Boost Serum', salePrice: 12.56, originalPrice: 26.79, discountPercent: 53 },
      { asin: 'B0DBRH4D1G', title: 'TreeActiv Body & Back Acne Spray', salePrice: 9.79, originalPrice: 19.59, discountPercent: 50 },
      { asin: 'B0DMNV3X3L', title: 'Spa Gift Set', salePrice: 8.50, originalPrice: 16.99, discountPercent: 50 },
      { asin: 'B0FX3MH5BX', title: 'Peel Shot Glow Rice Ampoule Duo', salePrice: 9.99, originalPrice: 15.96, discountPercent: 37 },
      { asin: 'B0BLY1CWJ4', title: 'Aveeno Daily Moisturizing Lotion', salePrice: 13.95, originalPrice: 22.00, discountPercent: 37 },
      { asin: 'B0BYD879V4', title: 'FRCOLOR Cotton Facial Mask Sheets', salePrice: 27.43, originalPrice: 34.29, discountPercent: 20 },
      { asin: 'B0FVX2WQ41', title: 'Black & White Rice Peeling Set', salePrice: 8.00, originalPrice: 18.99, discountPercent: 58 },
    ];

    logger.info(`[SEED REAL SKINCARE] Processing ${productsData.length} products`);

    // 3. Fetch images from Amazon API for each product (batch to avoid rate limits)
    const productsWithImages: Array<ProductData & { imageUrl?: string }> = [];
    
    logger.info('[SEED REAL SKINCARE] Fetching product images from Amazon API...');
    
    // Helper function to get product image by ASIN
    const getProductImageByASIN = async (asin: string): Promise<string | null> => {
      try {
        if (!config.AMAZON_ACCESS_KEY || !config.AMAZON_SECRET_KEY || !config.AMAZON_ASSOCIATE_TAG) {
          logger.warn('[SEED REAL SKINCARE] Amazon credentials not configured, skipping image fetch');
          return null;
        }

        const endpoint = 'webservices.amazon.com';
        const uri = '/paapi5/getitems';
        const method = 'POST';
        const service = 'ProductAdvertisingAPI';
        const region = config.AMAZON_REGION || 'us-east-1';
        
        const now = new Date();
        const dateStamp = now.toISOString().substring(0, 10).replace(/-/g, '');
        const timeStamp = now.toISOString().substring(11, 19).replace(/:/g, '');
        const timestamp = `${dateStamp}T${timeStamp}Z`;

        const payload = JSON.stringify({
          PartnerType: 'Associates',
          PartnerTag: config.AMAZON_ASSOCIATE_TAG.trim(),
          Marketplace: 'www.amazon.com',
          ItemIds: [asin],
          Resources: [
            'Images.Primary.Large',
            'Images.Primary.Medium',
            'Images.Primary.Small',
            'ItemInfo.Title',
          ],
        });

        // Generate AWS Signature Version 4
        const canonicalUri = uri;
        const canonicalQueryString = '';
        const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${endpoint}\nx-amz-date:${timestamp}\n`;
        const signedHeaders = 'content-type;host;x-amz-date';
        const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
        const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;
        
        const kDate = crypto.createHmac('sha256', `AWS4${config.AMAZON_SECRET_KEY}`).update(dateStamp).digest();
        const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
        const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
        const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
        const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
        
        const authorization = `${algorithm} Credential=${config.AMAZON_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        const response = await fetch(`https://${endpoint}${uri}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Amz-Date': timestamp,
            'Authorization': authorization,
          },
          body: payload,
        });

        if (!response.ok) {
          logger.warn(`[SEED REAL SKINCARE] Amazon API error for ASIN ${asin}: ${response.status}`);
          return null;
        }

        const data = await response.json() as any;
        
        if (data?.ItemsResult?.Items?.[0]) {
          const item = data.ItemsResult.Items[0] as any;
          const imageUrl = item?.Images?.Primary?.Large?.URL || 
                          item?.Images?.Primary?.Medium?.URL || 
                          item?.Images?.Primary?.Small?.URL;
          if (imageUrl) {
            return imageUrl;
          }
        }
        
        return null;
      } catch (error: any) {
        logger.warn(`[SEED REAL SKINCARE] Failed to fetch image for ASIN ${asin}: ${error.message}`);
        return null;
      }
    };

    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      try {
        logger.info(`[SEED REAL SKINCARE] Fetching image for ${i + 1}/${productsData.length}: ${product.title} (ASIN: ${product.asin})`);
        
        const imageUrl = await getProductImageByASIN(product.asin);
        productsWithImages.push({ ...product, imageUrl: imageUrl || undefined });
        
        if (imageUrl) {
          logger.info(`[SEED REAL SKINCARE] ✅ Got image for ${product.title}`);
        } else {
          logger.warn(`[SEED REAL SKINCARE] ⚠️ No image for ${product.title}`);
        }
        
        // Add delay to avoid rate limiting (1.5 seconds between requests)
        if (i < productsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error: any) {
        logger.warn(`[SEED REAL SKINCARE] Failed to fetch image for ${product.asin}: ${error.message}`);
        productsWithImages.push(product); // Add without image
      }
    }

    // 4. Insert all products into database
    logger.info('[SEED REAL SKINCARE] Inserting products into database...');
    let insertedCount = 0;
    let updatedCount = 0;

    for (const product of productsWithImages) {
      try {
        // Build URLs
        const amazonUrl = `https://www.amazon.com/dp/${product.asin}`;
        const affiliateUrl = `https://www.amazon.com/dp/${product.asin}/?tag=victoria0cdb-20`;
        
        // Generate slug from title
        const slug = product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Check if product already exists (by ASIN in slug or name)
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              { slug: slug },
              { name: product.title },
            ],
          },
        });

        // Build images array
        const images = product.imageUrl ? [product.imageUrl] : [];
        
        if (existing) {
          // Update existing product
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              name: product.title,
              description: `${product.title} - ${product.discountPercent}% OFF - Now $${product.salePrice.toFixed(2)} (Was $${product.originalPrice.toFixed(2)})`,
              price: product.salePrice,
              categoryId: skincareCategory.id,
              stock: 999,
              featured: product.discountPercent >= 50,
              images: images,
            },
          });
          updatedCount++;
          logger.info(`[SEED REAL SKINCARE] ✅ Updated: ${product.title}${product.imageUrl ? ' (with image)' : ' (no image)'}`);
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              name: product.title,
              slug: slug,
              description: `${product.title} - ${product.discountPercent}% OFF - Now $${product.salePrice.toFixed(2)} (Was $${product.originalPrice.toFixed(2)})`,
              price: product.salePrice,
              categoryId: skincareCategory.id,
              stock: 999,
              featured: product.discountPercent >= 50,
              images: images,
            },
          });
          insertedCount++;
          logger.info(`[SEED REAL SKINCARE] ✅ Inserted: ${product.title}${product.imageUrl ? ' (with image)' : ' (no image)'}`);
        }
      } catch (error: any) {
        logger.error(`[SEED REAL SKINCARE] ❌ Failed to insert ${product.title}: ${error.message}`);
      }
    }

    logger.info('[SEED REAL SKINCARE] ========== SEED COMPLETE ==========');
    logger.info(`[SEED REAL SKINCARE] Total products processed: ${productsData.length}`);
    logger.info(`[SEED REAL SKINCARE] Products inserted: ${insertedCount}`);
    logger.info(`[SEED REAL SKINCARE] Products updated: ${updatedCount}`);
    logger.info(`[SEED REAL SKINCARE] Category: ${skincareCategory.name} (${skincareCategory.id})`);
    console.log(`[SEED REAL SKINCARE] ✅ Successfully seeded ${insertedCount + updatedCount} products`);

    return true;
  } catch (error: any) {
    logger.error('[SEED REAL SKINCARE] ========== SEED ERROR ==========');
    logger.error('[SEED REAL SKINCARE] Error:', error);
    logger.error('[SEED REAL SKINCARE] Error stack:', error.stack);
    console.error('[SEED REAL SKINCARE] ❌ Seed failed:', error.message);
    return false;
  }
}
