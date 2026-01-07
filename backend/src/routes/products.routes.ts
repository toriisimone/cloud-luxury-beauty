import { Router } from 'express';
import { body, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as productsController from '../controllers/products.controller';

const router = Router();

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
