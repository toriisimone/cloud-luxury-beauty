import { Router } from 'express';
import { logger } from '../config/logger';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import couponsRoutes from './coupons.routes';
import ordersRoutes from './orders.routes';
import usersRoutes from './users.routes';
import adminRoutes from './admin.routes';
import amazonRoutes from './amazon.routes';

const router = Router();

// Startup log to confirm main router is loaded
logger.info('[MAIN ROUTER] ✅ Main router module loaded and ready');
console.log('[MAIN ROUTER] ✅ Main router module loaded and ready');

// Log all route registrations
logger.info('[MAIN ROUTER] Registering routes...');
logger.info('[MAIN ROUTER] Mounting /auth routes');
router.use('/auth', authRoutes);

logger.info('[MAIN ROUTER] Mounting /products routes');
router.use('/products', productsRoutes);

logger.info('[MAIN ROUTER] Mounting /amazon routes');
router.use('/amazon', amazonRoutes);

logger.info('[MAIN ROUTER] Mounting /categories routes');
router.use('/categories', categoriesRoutes);

logger.info('[MAIN ROUTER] Mounting /coupons routes');
router.use('/coupons', couponsRoutes);

logger.info('[MAIN ROUTER] Mounting /orders routes');
router.use('/orders', ordersRoutes);

logger.info('[MAIN ROUTER] Mounting /users routes');
router.use('/users', usersRoutes);

logger.info('[MAIN ROUTER] Mounting /admin routes');
router.use('/admin', adminRoutes);

logger.info('[MAIN ROUTER] ✅ All routes registered successfully');
console.log('[MAIN ROUTER] ✅ All routes registered successfully');

export default router;
