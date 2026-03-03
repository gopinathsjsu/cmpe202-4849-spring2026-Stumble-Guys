import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import * as notificationController from '../controllers/notificationController_Sasi';

const router = Router();

router.get('/', authenticate, notificationController.listMyNotifications);
router.patch('/:id/read', authenticate, notificationController.markNotificationRead);

export default router;

