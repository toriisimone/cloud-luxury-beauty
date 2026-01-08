/**
 * Script to seed the database if it's empty
 * This can be run manually or as part of deployment
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndSeed() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    console.log(`Current database state: ${productCount} products, ${categoryCount} categories`);

    if (productCount === 0 || categoryCount === 0) {
      console.log('Database appears empty. Running seed script...');
      const { execSync } = require('child_process');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', cwd: __dirname + '/..' });
      console.log('Seed completed successfully!');
    } else {
      console.log('Database already has data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error checking/seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed();
