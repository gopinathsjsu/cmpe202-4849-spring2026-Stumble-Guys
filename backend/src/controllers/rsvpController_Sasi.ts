import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { RsvpService } from '../services/rsvpService_Sasi';
import { rsvpSchema } from '../validators/ticketSchemas_Sasi';

export async function upsertRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    const parsed = rsvpSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      errorResponse(res, parsed.error.message, 'VALIDATION_ERROR', 400);
      return;
    }

    const rsvp = await RsvpService.upsertRsvp(eventId, userId, parsed.data.status);
    successResponse(res, rsvp, 'RSVP updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to RSVP', 'RSVP_ERROR', error.statusCode || 500);
  }
}

