import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import * as eventController from '../controllers/eventController_Nikhil';

const router = Router();

router.get(
  '/dashboard',
  authenticate,
  authorize('organizer', 'admin'),
  eventController.getOrganizerDashboard
);

router.get(
  '/pending-rsvps',
  authenticate,
  authorize('organizer', 'admin'),
  eventController.getOrganizerPendingRsvps
);

export default router;
