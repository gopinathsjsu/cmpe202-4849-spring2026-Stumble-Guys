import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import * as userController from '../controllers/userController_Preetam';

const router = Router();

router.get('/', authenticate, authorize('admin'), userController.listUsers);
router.put('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;
