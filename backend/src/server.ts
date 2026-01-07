import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
