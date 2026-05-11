import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { RsvpService } from '../services/rsvpService_Sasi';

export async function getMyRsvps(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    const rsvps = await RsvpService.getRsvpsForUser(userId);
    successResponse(res, rsvps, 'Your RSVPs retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get RSVPs', 'GET_MY_RSVPS_ERROR', error.statusCode || 500);
  }
}

export async function getMyRsvpForEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id: eventId } = req.params;
    const { userId } = req.user!;
    const rsvp = await RsvpService.getUserRsvp(eventId, userId);
    successResponse(res, rsvp, 'RSVP status retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get RSVP', 'GET_RSVP_ME_ERROR', error.statusCode || 500);
  }
}

export async function createRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const { status } = req.body;
    const rsvp = await RsvpService.createOrUpdateRsvp(id, userId, status);
    successResponse(res, rsvp, 'RSVP created', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create RSVP', 'CREATE_RSVP_ERROR', error.statusCode || 500);
  }
}

export async function updateRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const { status } = req.body;
    const rsvp = await RsvpService.createOrUpdateRsvp(id, userId, status);
    successResponse(res, rsvp, 'RSVP updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update RSVP', 'UPDATE_RSVP_ERROR', error.statusCode || 500);
  }
}

export async function removeRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    await RsvpService.removeRsvp(id, userId);
    successResponse(res, null, 'RSVP removed');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to remove RSVP', 'REMOVE_RSVP_ERROR', error.statusCode || 500);
  }
}

export async function getEventRsvps(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 100;
    const result = await RsvpService.getEventRsvps(id, userId, role, page, limit);
    successResponse(res, result.data, 'RSVPs retrieved', 200, {
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get RSVPs', 'GET_RSVPS_ERROR', error.statusCode || 500);
  }
}

export async function approveRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { id: eventId, rsvpId } = req.params;
    const { userId, role } = req.user!;
    const rsvp = await RsvpService.approveRsvp(eventId, rsvpId, userId, role);
    successResponse(res, rsvp, 'RSVP approved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to approve RSVP', 'APPROVE_RSVP_ERROR', error.statusCode || 500);
  }
}

export async function rejectRsvp(req: Request, res: Response): Promise<void> {
  try {
    const { id: eventId, rsvpId } = req.params;
    const { userId, role } = req.user!;
    const rsvp = await RsvpService.rejectRsvp(eventId, rsvpId, userId, role);
    successResponse(res, rsvp, 'RSVP rejected');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to reject RSVP', 'REJECT_RSVP_ERROR', error.statusCode || 500);
  }
}
