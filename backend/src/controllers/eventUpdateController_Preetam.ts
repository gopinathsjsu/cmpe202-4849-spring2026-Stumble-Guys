import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { EventUpdateService } from '../services/eventUpdateService_Preetam';

export async function listUpdates(req: Request, res: Response): Promise<void> {
  try {
    const { id: eventId } = req.params;
    const rows = await EventUpdateService.list(eventId);
    successResponse(res, rows, 'Event updates retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to list updates', 'LIST_UPDATES_ERROR', error.statusCode || 500);
  }
}

export async function createUpdate(req: Request, res: Response): Promise<void> {
  try {
    const { id: eventId } = req.params;
    const { userId, role } = (req as any).user;
    const { message } = req.body as { message?: string };
    const created = await EventUpdateService.create({
      eventId,
      authorId: userId,
      authorRole: role,
      message: message ?? '',
    });
    successResponse(res, created, 'Event update created', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create update', 'CREATE_UPDATE_ERROR', error.statusCode || 500);
  }
}

