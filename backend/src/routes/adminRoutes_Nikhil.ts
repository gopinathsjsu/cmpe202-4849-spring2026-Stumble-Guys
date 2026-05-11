import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import { validate } from '../middleware/validate_Pratham';
import { categoryBodySchema, rejectEventBodySchema } from '../validators/adminSchemas_Nikhil';
import * as adminController from '../controllers/adminController_Nikhil';

const router = Router();

router.get('/events/pending', authenticate, authorize('admin'), adminController.getPendingEvents);
router.put('/events/:id/approve', authenticate, authorize('admin'), adminController.approveEvent);
router.put(
  '/events/:id/reject',
  authenticate,
  authorize('admin'),
  validate(rejectEventBodySchema),
  adminController.rejectEvent
);
router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);

router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  validate(categoryBodySchema),
  adminController.createCategory
);
router.put(
  '/categories/:id',
  authenticate,
  authorize('admin'),
  validate(categoryBodySchema),
  adminController.updateCategory
);
router.delete('/categories/:id', authenticate, authorize('admin'), adminController.deleteCategory);

export default router;
