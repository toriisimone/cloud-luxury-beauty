import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

export default router;
