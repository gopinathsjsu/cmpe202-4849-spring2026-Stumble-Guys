import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { NotificationService } from '../services/notificationService_Sasi';

export async function listMyNotifications(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    const notifications = await NotificationService.listMyNotifications(userId);
    successResponse(res, notifications, 'Notifications retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to list notifications', 'NOTIFICATIONS_ERROR', error.statusCode || 500);
  }
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    const { id } = req.params;
    const updated = await NotificationService.markAsRead(userId, id);
    successResponse(res, updated, 'Notification marked as read');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to mark as read', 'NOTIFICATION_READ_ERROR', error.statusCode || 500);
  }
}

