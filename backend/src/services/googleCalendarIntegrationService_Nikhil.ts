import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import prisma from '../config/database_Preetam';
import { jwtConfig } from '../config/jwt_Preetam';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

export class GoogleCalendarIntegrationService {
  static isConfigured(): boolean {
    return Boolean(
      process.env.GOOGLE_CALENDAR_CLIENT_ID &&
        process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
        process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );
  }

  private static createOAuth2Client() {
    const id = process.env.GOOGLE_CALENDAR_CLIENT_ID;
    const secret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
    const redirect = process.env.GOOGLE_CALENDAR_REDIRECT_URI;
    if (!id || !secret || !redirect) {
      throw new Error('Google Calendar OAuth is not configured');
    }
    return new google.auth.OAuth2(id, secret, redirect);
  }

  static getAuthorizationUrl(userId: string): string {
    const oauth2 = this.createOAuth2Client();
    const state = jwt.sign({ uid: userId }, jwtConfig.secret, { expiresIn: '15m' });
    return oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
      state,
    });
  }

  static async exchangeCodeAndSave(code: string, state: string): Promise<string> {
    let uid: string;
    try {
      const decoded = jwt.verify(state, jwtConfig.secret) as { uid: string };
      uid = decoded.uid;
    } catch {
      throw new Error('Invalid or expired OAuth state');
    }

    const oauth2 = this.createOAuth2Client();
    const { tokens } = await oauth2.getToken(code);

    if (tokens.refresh_token) {
      await prisma.user.update({
        where: { id: uid },
        data: { google_calendar_refresh_token: tokens.refresh_token },
      });
      return uid;
    }

    const existing = await prisma.user.findUnique({
      where: { id: uid },
      select: { google_calendar_refresh_token: true },
    });
    if (existing?.google_calendar_refresh_token) {
      return uid;
    }

    throw new Error(
      'Google did not return a new refresh token. In Google Account → Security → Third-party access, remove EventHub and try connecting again.'
    );
  }

  static async disconnect(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { google_calendar_refresh_token: null },
    });
  }

  static async insertPrimaryCalendarEvent(userId: string, eventId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { google_calendar_refresh_token: true },
    });
    if (!user?.google_calendar_refresh_token) {
      const err = new Error('Connect Google Calendar in your profile first');
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new Error('Event not found');
    }

    const oauth2 = this.createOAuth2Client();
    oauth2.setCredentials({ refresh_token: user.google_calendar_refresh_token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2 });
    const location = [event.venue_name, event.address, event.city].filter(Boolean).join(', ');
    const tz = event.timezone || 'UTC';

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description,
        location: location || undefined,
        start: {
          dateTime: event.start_date.toISOString(),
          timeZone: tz,
        },
        end: {
          dateTime: event.end_date.toISOString(),
          timeZone: tz,
        },
      },
    });

    return { htmlLink: res.data.htmlLink ?? null };
  }
}
