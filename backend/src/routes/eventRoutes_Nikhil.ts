import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { optionalAuthenticate } from '../middleware/optionalAuth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import { validate } from '../middleware/validate_Pratham';
import { createEventSchema, updateEventSchema } from '../validators/eventSchemas_Nikhil';
import * as eventController from '../controllers/eventController_Nikhil';
import * as eventUpdateController from '../controllers/eventUpdateController_Preetam';

const router = Router();

router.post('/', authenticate, authorize('organizer', 'admin'), validate(createEventSchema), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/my', authenticate, eventController.getMyEvents);
router.get('/:id/updates', eventUpdateController.listUpdates);
router.post('/:id/updates', authenticate, authorize('organizer', 'admin'), eventUpdateController.createUpdate);
router.get('/:id/guestlist', authenticate, authorize('organizer', 'admin'), eventController.getEventGuestlist);
router.get('/:slug', optionalAuthenticate, eventController.getEventBySlug);
router.put('/:id', authenticate, validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);
router.post('/:id/submit', authenticate, eventController.submitForApproval);
router.get('/:id/attendees', authenticate, eventController.getAttendees);

export default router;
