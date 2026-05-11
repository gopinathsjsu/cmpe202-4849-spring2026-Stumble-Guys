"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsvpService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const notificationService_Sasi_1 = require("./notificationService_Sasi");
const emailService_Sasi_1 = require("./emailService_Sasi");
const ADMIN_ROLE = 'admin';
function canManageEvent(organizerId, requesterId, requesterRole) {
    return requesterRole === ADMIN_ROLE || organizerId === requesterId;
}
class RsvpService {
    static async createOrUpdateRsvp(eventId, userId, status) {
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            select: { id: true, is_free: true, title: true, capacity: true },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (!event.is_free) {
            throw new Error('RSVP is only available for free events');
        }
        const approval_status = status === 'going' ? 'pending' : 'not_required';
        // Capacity enforcement (count only confirmed tickets + approved/not_required RSVPs)
        if (status === 'going' && event.capacity != null) {
            const [ticketCount, approvedRsvpCount] = await Promise.all([
                database_Preetam_1.default.ticket.count({ where: { event_id: eventId, status: 'confirmed' } }),
                database_Preetam_1.default.rsvp.count({
                    where: {
                        event_id: eventId,
                        status: 'going',
                        approval_status: { in: ['approved', 'not_required'] },
                    },
                }),
            ]);
            const booked = ticketCount + approvedRsvpCount;
            if (booked >= event.capacity) {
                const err = new Error('Event is full');
                err.statusCode = 409;
                throw err;
            }
        }
        const result = await database_Preetam_1.default.rsvp.upsert({
            where: {
                event_id_user_id: { event_id: eventId, user_id: userId },
            },
            update: { status, approval_status },
            create: {
                event_id: eventId,
                user_id: userId,
                status,
                approval_status,
            },
            include: {
                event: {
                    select: { id: true, title: true, organizer_id: true },
                },
            },
        });
        // Notify organizer about new RSVP requests (only when "Going" requires approval)
        if (status === 'going' && approval_status === 'pending') {
            const [organizer, attendee] = await Promise.all([
                database_Preetam_1.default.user.findUnique({
                    where: { id: result.event.organizer_id },
                    select: { id: true, email: true, first_name: true },
                }),
                database_Preetam_1.default.user.findUnique({
                    where: { id: userId },
                    select: { first_name: true, last_name: true },
                }),
            ]);
            if (organizer) {
                await notificationService_Sasi_1.NotificationService.createNotification(organizer.id, 'rsvp_request', 'New RSVP request', `A new RSVP request was received for "${result.event.title}".`, eventId);
                if (organizer.email) {
                    emailService_Sasi_1.EmailService.sendNewRsvpRequestEmail(organizer.email, {
                        organizerName: organizer.first_name,
                        eventTitle: result.event.title,
                        attendeeName: attendee ? `${attendee.first_name} ${attendee.last_name}`.trim() : undefined,
                    }).catch((e) => console.error('Failed to send RSVP request email', e));
                }
            }
        }
        return result;
    }
    static async removeRsvp(eventId, userId) {
        const rsvp = await database_Preetam_1.default.rsvp.findUnique({
            where: {
                event_id_user_id: { event_id: eventId, user_id: userId },
            },
        });
        if (!rsvp) {
            throw new Error('RSVP not found');
        }
        return database_Preetam_1.default.rsvp.delete({
            where: {
                event_id_user_id: { event_id: eventId, user_id: userId },
            },
        });
    }
    static async getEventRsvps(eventId, requesterId, requesterRole, page = 1, limit = 100) {
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            select: { id: true, organizer_id: true, title: true },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (!canManageEvent(event.organizer_id, requesterId, requesterRole)) {
            throw new Error('Not authorized to view RSVPs for this event');
        }
        const skip = (page - 1) * limit;
        const [rsvps, total] = await Promise.all([
            database_Preetam_1.default.rsvp.findMany({
                where: { event_id: eventId },
                include: {
                    user: {
                        select: { id: true, first_name: true, last_name: true, avatar_url: true, email: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            database_Preetam_1.default.rsvp.count({ where: { event_id: eventId } }),
        ]);
        return {
            data: rsvps,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getUserRsvp(eventId, userId) {
        return database_Preetam_1.default.rsvp.findUnique({
            where: {
                event_id_user_id: { event_id: eventId, user_id: userId },
            },
        });
    }
    static async getRsvpsForUser(userId) {
        return database_Preetam_1.default.rsvp.findMany({
            where: { user_id: userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        start_date: true,
                        end_date: true,
                        venue_name: true,
                        city: true,
                        image_url: true,
                        is_free: true,
                    },
                },
            },
            orderBy: { updated_at: 'desc' },
        });
    }
    static async approveRsvp(eventId, rsvpId, requesterId, requesterRole) {
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            select: { id: true, organizer_id: true, title: true, capacity: true },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (!canManageEvent(event.organizer_id, requesterId, requesterRole)) {
            throw new Error('Not authorized to approve RSVPs');
        }
        const rsvp = await database_Preetam_1.default.rsvp.findUnique({
            where: { id: rsvpId },
            include: {
                user: { select: { id: true, first_name: true, email: true } },
            },
        });
        if (!rsvp || rsvp.event_id !== eventId) {
            throw new Error('RSVP not found');
        }
        if (rsvp.status !== 'going') {
            throw new Error('Only guests who selected Going can be approved');
        }
        if (rsvp.approval_status === 'approved') {
            return rsvp;
        }
        const updated = await database_Preetam_1.default.$transaction(async (tx) => {
            // Capacity enforcement at approval time (transaction-safe)
            if (event.capacity != null) {
                const [ticketCount, approvedRsvpCount] = await Promise.all([
                    tx.ticket.count({ where: { event_id: eventId, status: 'confirmed' } }),
                    tx.rsvp.count({
                        where: {
                            event_id: eventId,
                            status: 'going',
                            approval_status: { in: ['approved', 'not_required'] },
                        },
                    }),
                ]);
                const booked = ticketCount + approvedRsvpCount;
                if (booked >= event.capacity) {
                    const err = new Error('Event is full');
                    err.statusCode = 409;
                    throw err;
                }
            }
            return tx.rsvp.update({
                where: { id: rsvpId },
                data: { approval_status: 'approved' },
                include: {
                    user: {
                        select: { id: true, first_name: true, last_name: true, avatar_url: true, email: true },
                    },
                },
            });
        });
        await notificationService_Sasi_1.NotificationService.createNotification(rsvp.user_id, 'rsvp_approved', 'RSVP approved', `Your request to attend "${event.title}" was approved. You're confirmed!`, eventId);
        if (updated.user?.email) {
            emailService_Sasi_1.EmailService.sendRsvpDecisionEmail(updated.user.email, {
                recipientName: updated.user.first_name,
                eventTitle: event.title,
                decision: 'approved',
            }).catch((e) => console.error('Failed to send RSVP decision email', e));
        }
        return updated;
    }
    static async rejectRsvp(eventId, rsvpId, requesterId, requesterRole) {
        const event = await database_Preetam_1.default.event.findUnique({
            where: { id: eventId },
            select: { id: true, organizer_id: true, title: true },
        });
        if (!event) {
            throw new Error('Event not found');
        }
        if (!canManageEvent(event.organizer_id, requesterId, requesterRole)) {
            throw new Error('Not authorized to reject RSVPs');
        }
        const rsvp = await database_Preetam_1.default.rsvp.findUnique({
            where: { id: rsvpId },
        });
        if (!rsvp || rsvp.event_id !== eventId) {
            throw new Error('RSVP not found');
        }
        if (rsvp.status !== 'going' || rsvp.approval_status !== 'pending') {
            throw new Error('Only pending Going RSVPs can be rejected');
        }
        const updated = await database_Preetam_1.default.rsvp.update({
            where: { id: rsvpId },
            data: { approval_status: 'rejected' },
            include: {
                user: {
                    select: { id: true, first_name: true, last_name: true, avatar_url: true, email: true },
                },
            },
        });
        await notificationService_Sasi_1.NotificationService.createNotification(rsvp.user_id, 'rsvp_rejected', 'RSVP update', `Your request to attend "${event.title}" was not approved by the organizer.`, eventId);
        const attendee = await database_Preetam_1.default.user.findUnique({
            where: { id: rsvp.user_id },
            select: { email: true, first_name: true },
        });
        if (attendee?.email) {
            emailService_Sasi_1.EmailService.sendRsvpDecisionEmail(attendee.email, {
                recipientName: attendee.first_name,
                eventTitle: event.title,
                decision: 'rejected',
            }).catch((e) => console.error('Failed to send RSVP decision email', e));
        }
        return updated;
    }
}
exports.RsvpService = RsvpService;
