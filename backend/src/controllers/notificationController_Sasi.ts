import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { NotificationService } from '../services/notificationService_Sasi';
import { CalendarService } from '../services/calendarService_Sasi';
import prisma from '../config/database_Preetam';

export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const notifications = await NotificationService.getUserNotifications(userId);
    successResponse(res, notifications, 'Notifications retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get notifications', 'GET_NOTIFICATIONS_ERROR', error.statusCode || 500);
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = (req as any).user;
    const result = await NotificationService.markAsRead(id, userId);
    successResponse(res, result, 'Notification marked as read');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to mark notification', 'MARK_READ_ERROR', error.statusCode || 500);
  }
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const result = await NotificationService.markAllAsRead(userId);
    successResponse(res, result, 'All notifications marked as read');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to mark all notifications', 'MARK_ALL_READ_ERROR', error.statusCode || 500);
  }
}

export async function getCalendarFile(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        venue_name: true,
        address: true,
        city: true,
      },
    });
    if (!event) {
      errorResponse(res, 'Event not found', 'EVENT_NOT_FOUND', 404);
      return;
    }
    const icsContent = CalendarService.generateICS(event);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="event-${id}.ics"`);
    res.send(icsContent);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to generate calendar file', 'CALENDAR_ERROR', error.statusCode || 500);
  }
}
