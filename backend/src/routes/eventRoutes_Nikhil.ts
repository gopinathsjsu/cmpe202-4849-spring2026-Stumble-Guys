import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import * as eventController from '../controllers/eventController_Nikhil';

const router = Router();

router.post('/', authenticate, authorize('organizer', 'admin'), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:slug', eventController.getEventBySlug);

export default router;
