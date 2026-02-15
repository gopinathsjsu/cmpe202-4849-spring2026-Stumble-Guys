import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { TicketService } from '../services/ticketService_Sasi';

export async function purchaseTickets(req: Request, res: Response): Promise<void> {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    const result = await TicketService.purchaseTickets(eventId, userId, req.body);
    successResponse(res, result, 'Tickets purchased', 201);
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to purchase tickets',
      'PURCHASE_TICKETS_ERROR',
      error.statusCode || 501
    );
  }
}

