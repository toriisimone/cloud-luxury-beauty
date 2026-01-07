import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

console.log('DEBUG: Initializing PrismaClient...');
console.log('DEBUG: DATABASE_URL from process.env length =', process.env.DATABASE_URL?.length || 0);
console.log('DEBUG: DATABASE_URL (first 50 chars) =', process.env.DATABASE_URL?.substring(0, 50) || 'undefined');

// PrismaClient automatically reads DATABASE_URL from process.env
// The Prisma schema uses env("DATABASE_URL"), so PrismaClient will use process.env.DATABASE_URL
// We've already ensured dotenv doesn't override Railway's DATABASE_URL in production
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

console.log('DEBUG: PrismaClient created');

export async function connectDatabase() {
  try {
    console.log('DEBUG: connectDatabase() called');
    console.log('DEBUG: About to call prisma.$connect()...');
    await prisma.$connect();
    console.log('DEBUG: prisma.$connect() succeeded');
    logger.info('Connected to database');
  } catch (error: any) {
    console.error('DEBUG: Database connection error:');
    console.error('DEBUG: Error type:', error?.constructor?.name);
    console.error('DEBUG: Error message:', error?.message);
    console.error('DEBUG: Error code:', error?.code);
    console.error('DEBUG: Error stack:', error?.stack);
    logger.error('Database connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export default prisma;
