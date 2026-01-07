import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as ordersController from '../controllers/orders.controller';

const router = Router();

router.get('/', authenticate, ordersController.getOrders);
router.get('/:id', authenticate, ordersController.getOrderById);

router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isUUID(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingAddress.street').trim().notEmpty(),
    body('shippingAddress.city').trim().notEmpty(),
    body('shippingAddress.state').trim().notEmpty(),
    body('shippingAddress.zipCode').trim().notEmpty(),
    body('shippingAddress.country').trim().notEmpty(),
  ],
  validateRequest([]),
  ordersController.createOrder
);

router.put(
  '/:id/status',
  authenticate,
  requireAdmin,
  [body('status').isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])],
  validateRequest([]),
  ordersController.updateOrderStatus
);

export default router;
