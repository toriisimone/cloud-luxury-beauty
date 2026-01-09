// DEBUG: Log at the very start
console.log('DEBUG: ========================================');
console.log('DEBUG: Backend starting...');
console.log('DEBUG: Node version:', process.version);
console.log('DEBUG: Current working directory:', process.cwd());
console.log('DEBUG: All process.env keys:', Object.keys(process.env).sort());
console.log('DEBUG: Process.env count:', Object.keys(process.env).length);
console.log('DEBUG: NODE_ENV from process.env:', process.env.NODE_ENV);
console.log('DEBUG: RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('DEBUG: RAILWAY_SERVICE_NAME:', process.env.RAILWAY_SERVICE_NAME);
console.log('DEBUG: RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
console.log('DEBUG: ========================================');

import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import { autoMigrate } from './utils/autoMigrate';
import { autoSeedIfEmpty } from './utils/autoSeed';
// AMAZON API DISABLED: No cache refresh
// import { refreshProductCache } from './services/amazonApi.service';

console.log('DEBUG: Imports completed, config loaded');
console.log('DEBUG: DATABASE_URL from config length =', config.DATABASE_URL.length);

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    console.log('DEBUG: Starting server function...');
    console.log('DEBUG: About to connect to database...');
    console.log('DEBUG: DATABASE_URL (first 50 chars) =', config.DATABASE_URL.substring(0, 50));
    
    await connectDatabase();
    console.log('DEBUG: Database connected successfully');
    logger.info('Database connected successfully');

    // Run automatic migrations to ensure database schema is up to date
    logger.info('Running automatic migrations...');
    try {
      await autoMigrate();
      logger.info('Automatic migrations completed');
    } catch (error: any) {
      // If migrations fail, log but continue - tables might already exist
      logger.error('Migration failed, but continuing startup:', error);
      console.error('DEBUG: Migration error (non-fatal):', error.message);
    }

    // Auto-seed database if empty (runs automatically on startup)
    // This runs AFTER migrations to ensure tables exist
    logger.info('Running auto-seed check...');
    try {
      await autoSeedIfEmpty();
      logger.info('Auto-seed check completed.');
    } catch (error: any) {
      // If seeding fails, log but continue - server can still run
      logger.error('Auto-seed failed, but continuing startup:', error);
      console.error('DEBUG: Auto-seed error (non-fatal):', error.message);
    }

    // FORCE SEED ALL 82 SKINCARE PRODUCTS ON STARTUP
    // This ensures all 82 products are always in the database
    logger.info('========== FORCING SEED OF ALL 82 SKINCARE PRODUCTS ==========');
    console.log('[SERVER STARTUP] ========== FORCING SEED OF ALL 82 SKINCARE PRODUCTS ==========');
    try {
      const { seedAll82SkincareProducts } = await import('./utils/seedSkincare82Products');
      logger.info('[SERVER STARTUP] Calling seedAll82SkincareProducts()...');
      console.log('[SERVER STARTUP] Calling seedAll82SkincareProducts()...');
      
      const seeded = await seedAll82SkincareProducts();
      
      if (seeded) {
        logger.info('[SERVER STARTUP] ✅✅✅ ALL 82 SKINCARE PRODUCTS SEEDED SUCCESSFULLY ✅✅✅');
        console.log('[SERVER STARTUP] ✅✅✅ ALL 82 SKINCARE PRODUCTS SEEDED SUCCESSFULLY ✅✅✅');
      } else {
        logger.warn('[SERVER STARTUP] ⚠️ Seed function returned false, but continuing startup...');
        console.warn('[SERVER STARTUP] ⚠️ Seed function returned false, but continuing startup...');
      }
    } catch (error: any) {
      // If seeding fails, log but continue - server can still run
      logger.error('[SERVER STARTUP] ❌ Failed to seed 82 skincare products:', error);
      console.error('[SERVER STARTUP] ❌ Failed to seed 82 skincare products:', error.message);
      console.error('[SERVER STARTUP] Error stack:', error.stack);
    }
    logger.info('========== SKINCARE PRODUCT SEEDING COMPLETE ==========');
    console.log('[SERVER STARTUP] ========== SKINCARE PRODUCT SEEDING COMPLETE ==========');

    console.log('DEBUG: About to start Express server on port', PORT);
    app.listen(PORT, () => {
      console.log('DEBUG: Express server started successfully');
      console.log('Server running on port', PORT);
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`CORS origin: ${config.CORS_ORIGIN}`);

      // AMAZON API DISABLED: No cache initialization or hourly refresh
      // Amazon API calls are completely disabled - all products come from database
      logger.info('Amazon API is disabled - using database products only');
    });
  } catch (error: any) {
    console.error('DEBUG: ERROR in startServer():');
    console.error('DEBUG: Error type:', error?.constructor?.name);
    console.error('DEBUG: Error message:', error?.message);
    console.error('DEBUG: Error stack:', error?.stack);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

console.log('DEBUG: About to call startServer()...');
startServer().catch((error: any) => {
  console.error('DEBUG: Unhandled error in startServer():');
  console.error('DEBUG: Error type:', error?.constructor?.name);
  console.error('DEBUG: Error message:', error?.message);
  console.error('DEBUG: Error stack:', error?.stack);
  process.exit(1);
});
