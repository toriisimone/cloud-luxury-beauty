import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import * as adminController from '../controllers/admin.controller';
import * as productImagesAdminController from '../controllers/productImages.admin.controller';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Bulk update product images (Shopify CDN URLs only)
// Body: { updates: [{ slug: string, images: string[] }] }
router.put(
  '/products/images/bulk',
  [
    body('updates').isArray({ min: 1 }),
    body('updates.*.slug').isString().trim().notEmpty(),
    body('updates.*.images').isArray(),
    body('updates.*.images.*').isString().trim().notEmpty(),
  ],
  validateRequest([]),
  productImagesAdminController.bulkUpdateProductImages
);

// Audit products whose images[0] is NOT a Shopify CDN URL
router.get(
  '/products/images/audit',
  [query('limit').optional().isInt({ min: 1, max: 200 })],
  validateRequest([]),
  productImagesAdminController.auditProductImages
);

export default router;
