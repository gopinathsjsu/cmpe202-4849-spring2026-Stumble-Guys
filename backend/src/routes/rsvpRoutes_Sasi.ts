import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import * as rsvpController from '../controllers/rsvpController_Sasi';

const router = Router();

// Mounted at /api/v1/events
router.post('/:eventId/rsvp', authenticate, rsvpController.upsertRsvp);

export default router;

