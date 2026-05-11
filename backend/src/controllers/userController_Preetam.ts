import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { UserService } from '../services/userService_Preetam';

export async function listUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || undefined;
    const role = (req.query.role as string) || undefined;

    const result = await UserService.listUsers(page, limit, search, role);
    successResponse(res, result.data, 'Users retrieved', 200, {
      page,
      limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to list users', 'LIST_USERS_ERROR', error.statusCode || 500);
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const result = await UserService.updateUserRole(id, role);
    successResponse(res, result, 'User role updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update user role', 'ROLE_UPDATE_ERROR', error.statusCode || 500);
  }
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const result = await UserService.updateUserStatus(id, is_active);
    successResponse(res, result, 'User status updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update user status', 'STATUS_UPDATE_ERROR', error.statusCode || 500);
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const result = await UserService.deleteUser(id, userId);
    successResponse(res, result, 'User deleted');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete user', 'DELETE_USER_ERROR', error.statusCode || 500);
  }
}
