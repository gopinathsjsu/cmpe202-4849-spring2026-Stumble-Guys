import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { AdminService } from '../services/adminService_Nikhil';

export async function getPendingEvents(_req: Request, res: Response): Promise<void> {
  try {
    const events = await AdminService.getPendingEvents();
    successResponse(res, events, 'Pending events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get pending events', 'PENDING_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function approveEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const { notes } = req.body;
    const result = await AdminService.approveEvent(id, userId, notes);
    successResponse(res, result, 'Event approved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to approve event', 'APPROVE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function rejectEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const { notes } = req.body;
    const result = await AdminService.rejectEvent(id, userId, notes);
    successResponse(res, result, 'Event rejected');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to reject event', 'REJECT_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await AdminService.getDashboardStats();
    successResponse(res, stats, 'Dashboard stats retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get dashboard stats', 'DASHBOARD_STATS_ERROR', error.statusCode || 500);
  }
}
