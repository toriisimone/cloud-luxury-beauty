console.log('DEBUG: Loading app.ts...');

import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

console.log('DEBUG: App imports completed');

const app: Express = express();
console.log('DEBUG: Express app created');

// CORS configuration - use explicit env value(s) only
const corsOptions = {
  origin: config.CORS_ORIGIN.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Comprehensive request logging middleware - logs ALL requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  logger.info('[APP] ========== INCOMING REQUEST ==========');
  logger.info(`[APP] Timestamp: ${timestamp}`);
  logger.info(`[APP] Method: ${req.method}`);
  logger.info(`[APP] Path: ${req.path}`);
  logger.info(`[APP] Original URL: ${req.originalUrl}`);
  logger.info(`[APP] Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  logger.info(`[APP] Query:`, JSON.stringify(req.query, null, 2));
  logger.info(`[APP] Headers (Origin): ${req.get('origin') || 'N/A'}`);
  logger.info(`[APP] Headers (Referer): ${req.get('referer') || 'N/A'}`);
  logger.info(`[APP] ======================================`);
  console.log(`[APP] ${req.method} ${req.originalUrl} - Query:`, req.query);
  next();
});

// Routes
logger.info('[APP] Mounting API routes at /api');
console.log('[APP] Mounting API routes at /api');
app.use('/api', routes);
logger.info('[APP] ✅ API routes mounted at /api');
console.log('[APP] ✅ API routes mounted at /api');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
