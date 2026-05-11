import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { GoogleCalendarIntegrationService } from '../services/googleCalendarIntegrationService_Nikhil';
import prisma from '../config/database_Preetam';

const FRONTEND_BASE =
  process.env.FRONTEND_URL || process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

function redirectWithMessage(res: Response, ok: boolean, message?: string): void {
  const params = new URLSearchParams();
  params.set('google_calendar', ok ? 'connected' : 'error');
  if (message) params.set('message', message.slice(0, 500));
  res.redirect(`${FRONTEND_BASE.replace(/\/$/, '')}/profile?${params.toString()}`);
}

export async function googleCalendarConnectUrl(req: Request, res: Response): Promise<void> {
  try {
    if (!GoogleCalendarIntegrationService.isConfigured()) {
      errorResponse(
        res,
        'Google Calendar is not configured on this server (missing OAuth env vars).',
        'GOOGLE_CALENDAR_NOT_CONFIGURED',
        503
      );
      return;
    }
    const { userId } = req.user!;
    const authUrl = GoogleCalendarIntegrationService.getAuthorizationUrl(userId);
    successResponse(res, { authUrl }, 'Authorization URL created');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to start Google connection',
      'GOOGLE_CALENDAR_CONNECT_ERROR',
      error.statusCode || 500
    );
  }
}

export async function googleCalendarOAuthCallback(req: Request, res: Response): Promise<void> {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const errParam = req.query.error as string | undefined;

  if (errParam) {
    redirectWithMessage(res, false, 'Google sign-in was cancelled or denied.');
    return;
  }
  if (!code || !state) {
    redirectWithMessage(res, false, 'Missing OAuth parameters.');
    return;
  }
  if (!GoogleCalendarIntegrationService.isConfigured()) {
    redirectWithMessage(res, false, 'Server is not configured for Google Calendar.');
    return;
  }

  try {
    await GoogleCalendarIntegrationService.exchangeCodeAndSave(code, state);
    redirectWithMessage(res, true);
  } catch (error: any) {
    redirectWithMessage(res, false, error.message || 'Could not connect Google Calendar');
  }
}

export async function googleCalendarDisconnect(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    await GoogleCalendarIntegrationService.disconnect(userId);
    successResponse(res, { disconnected: true }, 'Google Calendar disconnected');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to disconnect',
      'GOOGLE_CALENDAR_DISCONNECT_ERROR',
      error.statusCode || 500
    );
  }
}

export async function googleCalendarStatus(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { google_calendar_refresh_token: true },
    });
    successResponse(res, {
      connected: Boolean(row?.google_calendar_refresh_token),
      configured: GoogleCalendarIntegrationService.isConfigured(),
    });
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to read status',
      'GOOGLE_CALENDAR_STATUS_ERROR',
      error.statusCode || 500
    );
  }
}

export async function googleCalendarPushEvent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.user!;
    const { eventId } = req.params;
    const result = await GoogleCalendarIntegrationService.insertPrimaryCalendarEvent(userId, eventId);
    successResponse(res, result, 'Event added to Google Calendar');
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to add event',
      'GOOGLE_CALENDAR_PUSH_ERROR',
      error.statusCode || 500
    );
  }
}
