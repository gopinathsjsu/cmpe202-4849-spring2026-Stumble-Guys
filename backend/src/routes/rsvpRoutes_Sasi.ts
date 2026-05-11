import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { validate } from '../middleware/validate_Pratham';
import { rsvpSchema } from '../validators/ticketSchemas_Sasi';
import * as rsvpController from '../controllers/rsvpController_Sasi';

const router = Router();

router.get('/rsvps/my', authenticate, rsvpController.getMyRsvps);
router.get('/:id/rsvp/me', authenticate, rsvpController.getMyRsvpForEvent);

router.get('/:id/rsvps', authenticate, rsvpController.getEventRsvps);
router.put('/:id/rsvps/:rsvpId/approve', authenticate, rsvpController.approveRsvp);
router.put('/:id/rsvps/:rsvpId/reject', authenticate, rsvpController.rejectRsvp);

router.post('/:id/rsvp', authenticate, validate(rsvpSchema), rsvpController.createRsvp);
router.put('/:id/rsvp', authenticate, validate(rsvpSchema), rsvpController.updateRsvp);
router.delete('/:id/rsvp', authenticate, rsvpController.removeRsvp);

export default router;
