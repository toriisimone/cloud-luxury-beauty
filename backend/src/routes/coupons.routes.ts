import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as couponsController from '../controllers/coupons.controller';

const router = Router();

router.get('/', couponsController.getCoupons);
router.get('/:code', couponsController.getCouponByCode);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('code').trim().notEmpty().toUpperCase(),
    body('type').isIn(['PERCENTAGE', 'FIXED', 'BOGO']),
    body('value').isFloat({ min: 0 }),
  ],
  validateRequest([]),
  couponsController.createCoupon
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  couponsController.updateCoupon
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  couponsController.deleteCoupon
);

export default router;
