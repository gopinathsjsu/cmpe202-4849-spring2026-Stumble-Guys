import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import * as notificationController from '../controllers/notificationController_Sasi';

const router = Router();

router.get('/', authenticate, notificationController.getNotifications);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, notificationController.markAsRead);

export default router;
