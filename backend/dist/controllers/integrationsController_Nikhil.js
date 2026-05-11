"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCalendarConnectUrl = googleCalendarConnectUrl;
exports.googleCalendarOAuthCallback = googleCalendarOAuthCallback;
exports.googleCalendarDisconnect = googleCalendarDisconnect;
exports.googleCalendarStatus = googleCalendarStatus;
exports.googleCalendarPushEvent = googleCalendarPushEvent;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const googleCalendarIntegrationService_Nikhil_1 = require("../services/googleCalendarIntegrationService_Nikhil");
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const FRONTEND_BASE = process.env.FRONTEND_URL || process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
function redirectWithMessage(res, ok, message) {
    const params = new URLSearchParams();
    params.set('google_calendar', ok ? 'connected' : 'error');
    if (message)
        params.set('message', message.slice(0, 500));
    res.redirect(`${FRONTEND_BASE.replace(/\/$/, '')}/profile?${params.toString()}`);
}
async function googleCalendarConnectUrl(req, res) {
    try {
        if (!googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.isConfigured()) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Google Calendar is not configured on this server (missing OAuth env vars).', 'GOOGLE_CALENDAR_NOT_CONFIGURED', 503);
            return;
        }
        const { userId } = req.user;
        const authUrl = googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.getAuthorizationUrl(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, { authUrl }, 'Authorization URL created');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to start Google connection', 'GOOGLE_CALENDAR_CONNECT_ERROR', error.statusCode || 500);
    }
}
async function googleCalendarOAuthCallback(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    const errParam = req.query.error;
    if (errParam) {
        redirectWithMessage(res, false, 'Google sign-in was cancelled or denied.');
        return;
    }
    if (!code || !state) {
        redirectWithMessage(res, false, 'Missing OAuth parameters.');
        return;
    }
    if (!googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.isConfigured()) {
        redirectWithMessage(res, false, 'Server is not configured for Google Calendar.');
        return;
    }
    try {
        await googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.exchangeCodeAndSave(code, state);
        redirectWithMessage(res, true);
    }
    catch (error) {
        redirectWithMessage(res, false, error.message || 'Could not connect Google Calendar');
    }
}
async function googleCalendarDisconnect(req, res) {
    try {
        const { userId } = req.user;
        await googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.disconnect(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, { disconnected: true }, 'Google Calendar disconnected');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to disconnect', 'GOOGLE_CALENDAR_DISCONNECT_ERROR', error.statusCode || 500);
    }
}
async function googleCalendarStatus(req, res) {
    try {
        const { userId } = req.user;
        const row = await database_Preetam_1.default.user.findUnique({
            where: { id: userId },
            select: { google_calendar_refresh_token: true },
        });
        (0, responseHelper_Pratham_1.successResponse)(res, {
            connected: Boolean(row?.google_calendar_refresh_token),
            configured: googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.isConfigured(),
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to read status', 'GOOGLE_CALENDAR_STATUS_ERROR', error.statusCode || 500);
    }
}
async function googleCalendarPushEvent(req, res) {
    try {
        const { userId } = req.user;
        const { eventId } = req.params;
        const result = await googleCalendarIntegrationService_Nikhil_1.GoogleCalendarIntegrationService.insertPrimaryCalendarEvent(userId, eventId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Event added to Google Calendar');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to add event', 'GOOGLE_CALENDAR_PUSH_ERROR', error.statusCode || 500);
    }
}
