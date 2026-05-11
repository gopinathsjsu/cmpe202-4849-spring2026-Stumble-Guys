"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
class NotificationService {
    static async createNotification(userId, type, title, message, eventId, channel = 'in_app') {
        return database_Preetam_1.default.notification.create({
            data: {
                user_id: userId,
                type,
                title,
                message,
                event_id: eventId,
                channel,
            },
        });
    }
    static async getUserNotifications(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            database_Preetam_1.default.notification.findMany({
                where: { user_id: userId },
                include: {
                    event: {
                        select: { id: true, slug: true, title: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { sent_at: 'desc' },
            }),
            database_Preetam_1.default.notification.count({ where: { user_id: userId } }),
        ]);
        return {
            data: notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async markAsRead(notificationId, userId) {
        const notification = await database_Preetam_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        if (notification.user_id !== userId) {
            throw new Error('Not authorized to update this notification');
        }
        return database_Preetam_1.default.notification.update({
            where: { id: notificationId },
            data: { is_read: true },
        });
    }
    static async markAllAsRead(userId) {
        return database_Preetam_1.default.notification.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true },
        });
    }
    static async getUnreadCount(userId) {
        return database_Preetam_1.default.notification.count({
            where: { user_id: userId, is_read: false },
        });
    }
}
exports.NotificationService = NotificationService;
