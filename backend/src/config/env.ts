import dotenv from 'dotenv';

// DEBUG: Log before loading env
console.log('DEBUG: Loading environment variables...');
console.log('DEBUG: NODE_ENV =', process.env.NODE_ENV);
console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DEBUG: DATABASE_URL length =', process.env.DATABASE_URL?.length || 0);
console.log('DEBUG: DATABASE_URL (first 20 chars) =', process.env.DATABASE_URL?.substring(0, 20) || 'undefined');

dotenv.config();

// DEBUG: Log after dotenv.config()
console.log('DEBUG: After dotenv.config()');
console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DEBUG: DATABASE_URL length =', process.env.DATABASE_URL?.length || 0);

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
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
