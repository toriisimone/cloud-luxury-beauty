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

    console.log('DEBUG: About to start Express server on port', PORT);
    app.listen(PORT, () => {
      console.log('DEBUG: Express server started successfully');
      console.log('Server running on port', PORT);
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`CORS origin: ${config.CORS_ORIGIN}`);
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
