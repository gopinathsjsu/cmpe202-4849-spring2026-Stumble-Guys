import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import * as ticketController from '../controllers/ticketController_Sasi';

const router = Router();

// Mounted at /api/v1/events
router.post('/:eventId/tickets/purchase', authenticate, ticketController.purchaseTickets);

export default router;

