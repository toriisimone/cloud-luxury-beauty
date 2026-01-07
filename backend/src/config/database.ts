import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Connected to database');
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export default prisma;
