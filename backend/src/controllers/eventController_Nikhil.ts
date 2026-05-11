import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { EventService } from '../services/eventService_Nikhil';
import type { EventFilters } from '../types/event_Nikhil';

/** Collect category UUIDs from repeated or comma-separated query params */
function parseCategoryIdsFromQuery(query: Request['query']): string[] | undefined {
  const keys = ['category_ids', 'category_id', 'category'] as const;
  const ids: string[] = [];
  for (const key of keys) {
    const v = query[key];
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const item of v) {
        const s = String(item).trim();
        if (s) ids.push(s);
      }
    } else {
      const s = String(v).trim();
      if (s.includes(',')) {
        ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
      } else if (s) {
        ids.push(s);
      }
    }
  }
  const unique = [...new Set(ids)];
  return unique.length ? unique : undefined;
}

function parseIsFreeFromQuery(query: Request['query']): boolean | undefined {
  const v = query.is_free;
  if (v === undefined || v === '') return undefined;
  if (Array.isArray(v)) {
    const s = String(v[0]).toLowerCase();
    if (s === 'true') return true;
    if (s === 'false') return false;
    return undefined;
  }
  const s = String(v).toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return undefined;
}

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
    const categoryIds = parseCategoryIdsFromQuery(req.query);
    const filters: EventFilters = {
      ...(categoryIds?.length === 1
        ? { category_id: categoryIds[0], category_ids: undefined }
        : categoryIds && categoryIds.length > 1
          ? { category_ids: categoryIds }
          : {}),
      search: req.query.search as string,
      start_date: (req.query.start_date ?? req.query.startDate) as string,
      end_date: (req.query.end_date ?? req.query.endDate) as string,
      city: req.query.city as string,
      is_free: parseIsFreeFromQuery(req.query),
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
    const requester = (req as any).user as { userId: string; role: string } | undefined;
    const event = await EventService.getEventBySlug(
      slug,
      requester ? { userId: requester.userId, role: requester.role } : undefined
    );
    successResponse(res, event, 'Event retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Event not found', 'EVENT_NOT_FOUND', error.statusCode || 404);
  }
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId, role } = (req as any).user;
    if (role === 'organizer') {
      errorResponse(res, 'Organizers cannot edit events. Use event updates instead.', 'FORBIDDEN', 403);
      return;
    }
    const event = await EventService.updateEvent(id, userId, req.body);
    successResponse(res, event, 'Event updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update event', 'UPDATE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId, role } = (req as any).user;
    await EventService.deleteEvent(id, userId, role);
    successResponse(res, null, 'Event deleted');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete event', 'DELETE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function getMyEvents(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = (req.query.status as string) || undefined;

    const result = await EventService.getEventsByOrganizer(
      userId,
      { status },
      page,
      limit
    );
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

export async function getOrganizerDashboard(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    const data = await EventService.getOrganizerDashboard(userId);
    successResponse(res, data, 'Organizer dashboard retrieved');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to load dashboard',
      'ORG_DASHBOARD_ERROR',
      error.statusCode || 500
    );
  }
}

export async function getOrganizerPendingRsvps(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    const rows = await EventService.getOrganizerPendingRsvps(userId);
    successResponse(res, rows, 'Pending RSVPs retrieved');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to load pending RSVPs',
      'ORG_PENDING_RSVPS_ERROR',
      error.statusCode || 500
    );
  }
}

export async function getEventGuestlist(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const search = (req.query.search as string) || undefined;
    const data = await EventService.getEventGuestlist(id, userId, search);
    successResponse(res, data, 'Guestlist retrieved');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to load guestlist',
      'GUESTLIST_ERROR',
      error.statusCode || 500
    );
  }
}
