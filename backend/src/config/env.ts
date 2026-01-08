import dotenv from 'dotenv';

// DEBUG: Log before loading env
console.log('DEBUG: ========================================');
console.log('DEBUG: Loading environment variables...');
console.log('DEBUG: Total process.env keys:', Object.keys(process.env).length);
console.log('DEBUG: All env keys:', Object.keys(process.env).sort().join(', '));
console.log('DEBUG: NODE_ENV =', process.env.NODE_ENV);
console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DEBUG: DATABASE_URL length =', process.env.DATABASE_URL?.length || 0);
console.log('DEBUG: DATABASE_URL (first 50 chars) =', process.env.DATABASE_URL?.substring(0, 50) || 'undefined');
console.log('DEBUG: JWT_SECRET exists?', !!process.env.JWT_SECRET);
console.log('DEBUG: JWT_REFRESH_SECRET exists?', !!process.env.JWT_REFRESH_SECRET);
console.log('DEBUG: CORS_ORIGIN =', process.env.CORS_ORIGIN);
console.log('DEBUG: PORT =', process.env.PORT);
console.log('DEBUG: ========================================');

// Only load .env file in development - in production, use Railway environment variables directly
// This ensures Railway's DATABASE_URL is never overridden by a local .env file
if (process.env.NODE_ENV !== 'production') {
  console.log('DEBUG: Development mode - loading .env file (will not override existing vars)');
  dotenv.config({ override: false }); // Don't override existing environment variables
} else {
  console.log('DEBUG: Production mode - using Railway environment variables only (skipping .env file)');
}

// DEBUG: Log after potential dotenv.config()
console.log('DEBUG: After environment loading');
console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DEBUG: DATABASE_URL length =', process.env.DATABASE_URL?.length || 0);
console.log('DEBUG: DATABASE_URL (first 50 chars) =', process.env.DATABASE_URL?.substring(0, 50) || 'undefined');

// Read environment variables directly from process.env - never use fallbacks or defaults
// This ensures Railway's environment variables are used exactly as provided
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  // CRITICAL: Read DATABASE_URL directly from process.env - no fallback, no default
  DATABASE_URL: process.env.DATABASE_URL || '',
  // CRITICAL: Read JWT secrets directly from process.env - no fallback, no default
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  // CORS origin must be provided via environment variable (no fallback)
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
  // Amazon Product Advertising API credentials
  AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY || '',
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY || '',
  AMAZON_ASSOCIATE_TAG: process.env.AMAZON_ASSOCIATE_TAG || '',
  AMAZON_REGION: process.env.AMAZON_REGION || 'us-east-1',
};

// DEBUG: Log config values (without secrets)
console.log('DEBUG: Config loaded:');
console.log('DEBUG: NODE_ENV =', config.NODE_ENV);
console.log('DEBUG: PORT =', config.PORT);
console.log('DEBUG: DATABASE_URL length =', config.DATABASE_URL.length);
console.log('DEBUG: JWT_SECRET exists?', !!config.JWT_SECRET);
console.log('DEBUG: JWT_REFRESH_SECRET exists?', !!config.JWT_REFRESH_SECRET);
console.log('DEBUG: CORS_ORIGIN =', config.CORS_ORIGIN);

if (!config.DATABASE_URL) {
  console.error('DEBUG: ERROR - DATABASE_URL is missing!');
  console.error('DEBUG: All env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('PG')));
  throw new Error('DATABASE_URL is required');
}

if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

if (!config.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is required');
}

if (!config.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN is required');
}
