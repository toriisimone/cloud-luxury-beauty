import { Router } from 'express';
import * as amazonController from '../controllers/amazon.controller';

const router = Router();

// Get Amazon skincare products (cached, refreshed hourly)
router.get('/skincare', amazonController.getAmazonProducts);

// Manually refresh Amazon products cache
router.post('/refresh', amazonController.refreshAmazonProducts);

export default router;
