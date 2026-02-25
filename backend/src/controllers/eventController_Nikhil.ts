import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { EventService } from '../services/eventService_Nikhil';
import type { EventFilters } from '../types/event_Nikhil';

export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const event = await EventService.createEvent(userId, req.body);
    successResponse(res, event, 'Event created', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create event', 'CREATE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function listEvents(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters: EventFilters = {
      category_id: req.query.category as string,
      search: req.query.search as string,
      start_date: req.query.startDate as string,
      end_date: req.query.endDate as string,
      is_free: req.query.is_free === 'true' ? true : undefined,
      status: req.query.status as string,
    };

    const result = await EventService.listEvents(filters, page, limit);
    successResponse(res, result.data, 'Events retrieved', 200, {
      page,
      limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to list events', 'LIST_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function getEventBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const event = await EventService.getEventBySlug(slug);
    successResponse(res, event, 'Event retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Event not found', 'EVENT_NOT_FOUND', error.statusCode || 404);
  }
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const event = await EventService.updateEvent(id, userId, req.body);
    successResponse(res, event, 'Event updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update event', 'UPDATE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    await EventService.deleteEvent(id, userId);
    successResponse(res, null, 'Event deleted');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete event', 'DELETE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function getMyEvents(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const result = await EventService.getEventsByOrganizer(userId);
    successResponse(res, result.data, 'Organizer events retrieved', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get events', 'MY_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function submitForApproval(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const result = await EventService.submitForApproval(id, userId);
    successResponse(res, result, 'Event submitted for approval');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to submit event', 'SUBMIT_APPROVAL_ERROR', error.statusCode || 500);
  }
}

export async function getAttendees(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const attendees = await EventService.getAttendees(id, userId);
    successResponse(res, attendees, 'Attendees retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get attendees', 'ATTENDEES_ERROR', error.statusCode || 500);
  }
}
