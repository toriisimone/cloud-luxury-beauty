import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import couponsRoutes from './coupons.routes';
import ordersRoutes from './orders.routes';
import usersRoutes from './users.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/coupons', couponsRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

export default router;
