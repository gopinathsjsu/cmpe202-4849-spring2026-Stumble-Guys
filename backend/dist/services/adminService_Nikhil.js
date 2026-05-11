"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const notificationService_Sasi_1 = require("./notificationService_Sasi");
const emailService_Sasi_1 = require("./emailService_Sasi");
const MODERATION_STATUSES = ['pending_approval', 'approved', 'rejected'];
class AdminService {
    static async getModerationQueue(page = 1, limit = 10, status = 'pending_approval') {
        const resolvedStatus = MODERATION_STATUSES.includes(status)
            ? status
            : 'pending_approval';
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            database_Preetam_1.default.event.findMany({
                where: { status: resolvedStatus },
                include: {
                    organizer: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            avatar_url: true,
                        },
                    },
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            database_Preetam_1.default.event.count({ where: { status: resolvedStatus } }),
        ]);
        return {
            data: events,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    static async approveEvent(eventId, adminId, notes) {
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            include: { organizer: { select: { id: true, email: true, first_name: true } } },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.status !== 'pending_approval') {
            throw new Error('Event is not pending approval');
        }
        const updated = await database_Preetam_1.default.event.update({
            where: { id: eventId },
            data: {
                status: 'approved',
                approved_by: { connect: { id: adminId } },
                approved_at: new Date(),
                approval_notes: notes,
            },
        });
        // In-app + email for organizer (best-effort email)
        await notificationService_Sasi_1.NotificationService.createNotification(event.organizer_id, 'event_approved', 'Event approved', `"${event.title}" was approved and is now live.${notes ? ` Admin notes: ${notes}` : ''}`, eventId);
        if (event.organizer?.email) {
            emailService_Sasi_1.EmailService.sendApprovalNotification(event.organizer.email, event.title, 'approved', notes).catch((e) => console.error('Failed to send approval email', e));
        }
        return updated;
    }
    static async rejectEvent(eventId, adminId, notes) {
        const reason = notes?.trim();
        if (!reason) {
            const err = new Error('Reason for rejection is required');
            err.statusCode = 400;
            throw err;
        }
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            include: { organizer: { select: { id: true, email: true, first_name: true } } },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.status !== 'pending_approval') {
            throw new Error('Event is not pending approval');
        }
        const updated = await database_Preetam_1.default.event.update({
            where: { id: eventId },
            data: {
                status: 'rejected',
                approved_by: { connect: { id: adminId } },
                approved_at: new Date(),
                approval_notes: reason,
            },
        });
        await notificationService_Sasi_1.NotificationService.createNotification(event.organizer_id, 'event_rejected', 'Event rejected', `"${event.title}" was rejected. ${reason ? `Admin notes: ${reason}` : ''}`.trim(), eventId);
        if (event.organizer?.email) {
            emailService_Sasi_1.EmailService.sendApprovalNotification(event.organizer.email, event.title, 'rejected', reason).catch((e) => console.error('Failed to send rejection email', e));
        }
        return updated;
    }
    static async getDashboardStats() {
        const [totalRegisteredUsers, totalActiveUsers, totalEventsCreated, totalRsvpsProcessed, pendingModerationCount, confirmedTickets,] = await Promise.all([
            database_Preetam_1.default.user.count(),
            database_Preetam_1.default.user.count({ where: { is_active: true } }),
            database_Preetam_1.default.event.count(),
            database_Preetam_1.default.rsvp.count(),
            database_Preetam_1.default.event.count({ where: { status: 'pending_approval' } }),
            database_Preetam_1.default.ticket.count({ where: { status: 'confirmed' } }),
        ]);
        return {
            totalRegisteredUsers,
            totalActiveUsers,
            totalEventsCreated,
            totalRsvpsProcessed,
            pendingModerationCount,
            confirmedTickets,
            /** @deprecated use totalRegisteredUsers */
            totalUsers: totalRegisteredUsers,
            /** @deprecated use totalEventsCreated */
            totalEvents: totalEventsCreated,
            totalTickets: confirmedTickets,
        };
    }
}
exports.AdminService = AdminService;
