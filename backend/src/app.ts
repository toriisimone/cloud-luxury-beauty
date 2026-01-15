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
const allowedOrigins = config.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// IMPORTANT:
// - Vercel deployments can change domains (preview + prod).
// - If CORS blocks the frontend, the site will show "no products" even while backend is healthy.
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Non-browser requests (curl/postman/server-to-server) have no Origin header.
    if (!origin) return callback(null, true);

    // Exact allowlist from env
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow Vercel frontends (prod + preview) to prevent breaking deployments.
    // Example: https://cloud-luxury-beauty-frontend-22it8mee5-luxesavings.vercel.app
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
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
