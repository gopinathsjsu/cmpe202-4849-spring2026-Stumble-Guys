"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.getCalendarFile = getCalendarFile;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const notificationService_Sasi_1 = require("../services/notificationService_Sasi");
const calendarService_Sasi_1 = require("../services/calendarService_Sasi");
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
async function getNotifications(req, res) {
    try {
        const { userId } = req.user;
        const notifications = await notificationService_Sasi_1.NotificationService.getUserNotifications(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, notifications, 'Notifications retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get notifications', 'GET_NOTIFICATIONS_ERROR', error.statusCode || 500);
    }
}
async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const result = await notificationService_Sasi_1.NotificationService.markAsRead(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Notification marked as read');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to mark notification', 'MARK_READ_ERROR', error.statusCode || 500);
    }
}
async function markAllAsRead(req, res) {
    try {
        const { userId } = req.user;
        const result = await notificationService_Sasi_1.NotificationService.markAllAsRead(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'All notifications marked as read');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to mark all notifications', 'MARK_ALL_READ_ERROR', error.statusCode || 500);
    }
}
async function getCalendarFile(req, res) {
    try {
        const { id } = req.params;
        const event = await database_Preetam_1.default.event.findUnique({
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
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Event not found', 'EVENT_NOT_FOUND', 404);
            return;
        }
        const icsContent = calendarService_Sasi_1.CalendarService.generateICS(event);
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="event-${id}.ics"`);
        res.send(icsContent);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to generate calendar file', 'CALENDAR_ERROR', error.statusCode || 500);
    }
}
