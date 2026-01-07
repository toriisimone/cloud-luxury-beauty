import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  validateRequest([]),
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validateRequest([]),
  authController.login
);

router.post(
  '/refresh',
  [body('refreshToken').notEmpty()],
  validateRequest([]),
  authController.refreshToken
);

router.post('/logout', authenticate, authController.logout);

export default router;
