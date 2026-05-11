import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { authorize } from '../middleware/roleGuard_Preetam';
import { validate } from '../middleware/validate_Pratham';
import { createTicketTypeSchema, purchaseTicketSchema } from '../validators/ticketSchemas_Sasi';
import * as ticketController from '../controllers/ticketController_Sasi';

const router = Router();

// Specific paths first to avoid conflicts with /:id
router.get('/tickets/my', authenticate, ticketController.getMyTickets);
router.get('/tickets/:id', authenticate, ticketController.getTicketById);
router.put('/tickets/:id/cancel', authenticate, ticketController.cancelTicket);

// Parameterized event-scoped routes
router.get('/:id/ticket-types', ticketController.getTicketTypes);
router.post('/:id/ticket-types', authenticate, authorize('organizer', 'admin'), validate(createTicketTypeSchema), ticketController.createTicketType);
router.post('/:id/tickets/purchase', authenticate, validate(purchaseTicketSchema), ticketController.purchaseTicket);

export default router;
