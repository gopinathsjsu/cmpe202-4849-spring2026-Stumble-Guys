import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { TicketService } from '../services/ticketService_Sasi';

export async function createTicketType(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const ticketType = await TicketService.createTicketType(id, userId, req.body);
    successResponse(res, ticketType, 'Ticket type created', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create ticket type', 'CREATE_TICKET_TYPE_ERROR', error.statusCode || 500);
  }
}

export async function getTicketTypes(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const ticketTypes = await TicketService.getTicketTypes(id);
    successResponse(res, ticketTypes, 'Ticket types retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get ticket types', 'GET_TICKET_TYPES_ERROR', error.statusCode || 500);
  }
}

export async function purchaseTicket(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const { id } = req.params;
    const ticket = await TicketService.purchaseTicket(userId, id, req.body);
    successResponse(res, ticket, 'Ticket purchased', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to purchase ticket', 'PURCHASE_TICKET_ERROR', error.statusCode || 500);
  }
}

export async function getMyTickets(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const result = await TicketService.getMyTickets(userId);
    successResponse(res, result.data, 'Tickets retrieved', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get tickets', 'GET_TICKETS_ERROR', error.statusCode || 500);
  }
}

export async function getTicketById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const ticket = await TicketService.getTicketById(id, userId);
    successResponse(res, ticket, 'Ticket retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get ticket', 'GET_TICKET_ERROR', error.statusCode || 500);
  }
}

export async function cancelTicket(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const result = await TicketService.cancelTicket(id, userId);
    successResponse(res, result, 'Ticket cancelled');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to cancel ticket', 'CANCEL_TICKET_ERROR', error.statusCode || 500);
  }
}
