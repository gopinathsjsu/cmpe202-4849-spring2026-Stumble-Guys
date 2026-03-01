import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { TicketService } from '../services/ticketService_Sasi';
import { purchaseTicketsSchema } from '../validators/ticketSchemas_Sasi';

export async function purchaseTickets(req: Request, res: Response): Promise<void> {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    const parsed = purchaseTicketsSchema.safeParse(req.body);
    if (!parsed.success) {
      errorResponse(res, parsed.error.message, 'VALIDATION_ERROR', 400);
      return;
    }

    const result = await TicketService.purchaseTickets(eventId, userId, parsed.data);
    successResponse(res, result, 'Tickets purchased', 201);
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to purchase tickets',
      'PURCHASE_TICKETS_ERROR',
      error.statusCode || 500
    );
  }
}

