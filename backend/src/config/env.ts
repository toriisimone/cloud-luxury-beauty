import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

if (!config.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is required');
}
