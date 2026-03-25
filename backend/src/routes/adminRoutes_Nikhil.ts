import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import * as adminController from '../controllers/adminController_Nikhil';

const router = Router();

router.get('/events/pending', authenticate, authorize('admin'), adminController.getPendingEvents);
router.put('/events/:id/approve', authenticate, authorize('admin'), adminController.approveEvent);
router.put('/events/:id/reject', authenticate, authorize('admin'), adminController.rejectEvent);
router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);

export default router;
