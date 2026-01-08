# Amazon Product Advertising API Setup

This document explains how to set up the Amazon Product Advertising API integration for fetching real skincare products.

## Environment Variables

Add the following environment variables to your Railway backend service:

### Required Variables

1. **AMAZON_ACCESS_KEY**
   - Value: `AKPAEP8TAS1765655988`
   - Description: Your Amazon Product Advertising API Access Key ID

2. **AMAZON_SECRET_KEY**
   - Value: `jfnpywg692/MGx1vA50BXhRwBoU0B7HNCiVKdtA`
   - Description: Your Amazon Product Advertising API Secret Access Key

3. **AMAZON_ASSOCIATE_TAG**
   - Value: `victoria0cdb-20`
   - Description: Your Amazon Associates affiliate tag

4. **AMAZON_REGION** (Optional)
   - Value: `us-east-1` (default)
   - Description: AWS region for API requests

## How to Add Variables in Railway

1. Go to your Railway project dashboard
2. Select your backend service
3. Click on the "Variables" tab
4. Click "New Variable" for each variable above
5. Enter the variable name and value
6. Save and redeploy

## API Endpoints

### Get Amazon Skincare Products
- **Endpoint**: `GET /api/amazon/skincare`
- **Description**: Returns cached Amazon skincare products (refreshed hourly)
- **Response**: 
  ```json
  {
    "products": [...],
    "count": 100,
    "source": "amazon"
  }
  ```

### Refresh Amazon Products Cache
- **Endpoint**: `POST /api/amazon/refresh`
- **Description**: Manually refreshes the product cache
- **Response**: Same as above

## How It Works

1. **Product Fetching**: The backend fetches skincare products from Amazon using the Product Advertising API
2. **Caching**: Products are cached for 1 hour to avoid hitting API rate limits
3. **Automatic Refresh**: The cache is automatically refreshed every hour
4. **Affiliate Links**: All product URLs include your affiliate tag (`victoria0cdb-20`)

## Product Data Retrieved

For each product, the following data is fetched:
- Product title
- Price
- Main image URL
- ASIN (Amazon Standard Identification Number)
- Rating (if available)
- Review count (if available)
- Size (if available)
- Tags (Best-seller, Award Winner, New)

## Frontend Integration

The frontend automatically uses Amazon products when:
- User navigates to `/products?category=Skincare`
- Homepage displays skincare section

If Amazon API fails, the system falls back to regular database products.

## Troubleshooting

### Products Not Showing

1. **Check Environment Variables**: Ensure all Amazon API credentials are set in Railway
2. **Check Backend Logs**: Look for Amazon API errors in Railway logs
3. **Verify API Credentials**: Ensure your Access Key and Secret Key are valid and active
4. **Check API Limits**: Amazon has rate limits - if exceeded, wait before retrying

### API Errors

Common errors:
- **InvalidSignatureException**: Check that your Access Key and Secret Key are correct
- **RequestThrottled**: Too many requests - wait before retrying
- **InvalidPartnerTag**: Check that your Associate Tag is correct

## Notes

- The Amazon Product Advertising API requires proper AWS Signature Version 4 signing
- API requests are rate-limited by Amazon
- Products are cached to minimize API calls
- All product links include your affiliate tag for commission tracking
