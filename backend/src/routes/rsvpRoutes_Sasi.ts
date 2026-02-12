import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';

const router = Router();

// Mounted at /api/v1/events
router.post('/:eventId/rsvp', authenticate, (_req, res) => {
  res.status(501).json({ message: 'RSVP endpoint not implemented yet' });
});

export default router;

