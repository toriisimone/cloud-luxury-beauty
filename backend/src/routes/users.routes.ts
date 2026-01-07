import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';
import * as usersController from '../controllers/users.controller';

const router = Router();

router.get('/profile', authenticate, usersController.getProfile);
router.put('/profile', authenticate, usersController.updateProfile);

router.get('/wishlist', authenticate, usersController.getWishlist);
router.post(
  '/wishlist',
  authenticate,
  [body('productId').isUUID()],
  validateRequest([]),
  usersController.addToWishlist
);
router.delete('/wishlist/:productId', authenticate, usersController.removeFromWishlist);

export default router;
