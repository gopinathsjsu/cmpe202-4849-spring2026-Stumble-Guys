import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { AdminService } from '../services/adminService_Nikhil';
import { CategoryAdminService } from '../services/categoryAdminService_Nikhil';

export async function getPendingEvents(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const status = (req.query.status as string) || 'pending_approval';
    const result = await AdminService.getModerationQueue(page, limit, status);
    successResponse(res, result, 'Events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get pending events', 'PENDING_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function approveEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const { notes } = req.body as { notes?: string };
    const result = await AdminService.approveEvent(id, userId, notes);
    successResponse(res, result, 'Event approved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to approve event', 'APPROVE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function rejectEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const { notes } = req.body as { notes: string };
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

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, icon } = req.body as { name: string; icon?: string | null };
    const row = await CategoryAdminService.create(name, icon);
    successResponse(res, row, 'Category created', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create category', 'CREATE_CATEGORY_ERROR', error.statusCode || 500);
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, icon } = req.body as { name: string; icon?: string | null };
    const row = await CategoryAdminService.update(id, name, icon);
    successResponse(res, row, 'Category updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update category', 'UPDATE_CATEGORY_ERROR', error.statusCode || 500);
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await CategoryAdminService.remove(id);
    successResponse(res, result, 'Category deleted');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete category', 'DELETE_CATEGORY_ERROR', error.statusCode || 500);
  }
}
