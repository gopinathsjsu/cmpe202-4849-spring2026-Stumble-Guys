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
