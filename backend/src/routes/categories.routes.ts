import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as categoriesController from '../controllers/categories.controller';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty(),
  ],
  validateRequest([]),
  categoriesController.createCategory
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  categoriesController.deleteCategory
);

export default router;
