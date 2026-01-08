import { Router } from 'express';
import { body, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as productsController from '../controllers/products.controller';
import { logger } from '../config/logger';

const router = Router();

// Startup log to confirm router is loaded
logger.info('[PRODUCTS ROUTER] ✅ Products router module loaded and ready');
console.log('[PRODUCTS ROUTER] ✅ Products router module loaded and ready');

// Log all requests to products routes
router.use((req, res, next) => {
  logger.info('[PRODUCTS ROUTER] ========== REQUEST RECEIVED ==========');
  logger.info(`[PRODUCTS ROUTER] Method: ${req.method}`);
  logger.info(`[PRODUCTS ROUTER] Path: ${req.path}`);
  logger.info(`[PRODUCTS ROUTER] Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  logger.info(`[PRODUCTS ROUTER] Query params:`, JSON.stringify(req.query, null, 2));
  logger.info(`[PRODUCTS ROUTER] ======================================`);
  next();
});

// Test endpoint to verify routing works
router.get('/test', (req, res) => {
  logger.info('[PRODUCTS ROUTER] ✅ TEST ENDPOINT HIT - Routing works!');
  console.log('[PRODUCTS ROUTER] ✅ TEST ENDPOINT HIT - Routing works!');
  res.json({ 
    message: 'Products router is working!',
    timestamp: new Date().toISOString(),
    path: req.path,
    query: req.query,
  });
});

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('categoryId').isUUID(),
    body('stock').isInt({ min: 0 }),
  ],
  validateRequest([]),
  productsController.createProduct
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  productsController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  productsController.deleteProduct
);

export default router;
