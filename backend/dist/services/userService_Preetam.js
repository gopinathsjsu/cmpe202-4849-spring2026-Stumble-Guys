"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const ROLES = ['admin', 'organizer', 'attendee'];
class UserService {
    static async revokeAllSessions(userId) {
        await database_Preetam_1.default.refreshToken.deleteMany({ where: { user_id: userId } });
    }
    /** Withdraw upcoming public listings when an organizer is deactivated or removed. */
    static async withdrawOrganizerPublicEvents(organizerId) {
        const now = new Date();
        await database_Preetam_1.default.event.updateMany({
            where: {
                organizer_id: organizerId,
                status: 'pending_approval',
                end_date: { gte: now },
            },
            data: {
                status: 'draft',
                approval_notes: 'Withdrawn: organizer account deactivated by admin',
            },
        });
        await database_Preetam_1.default.event.updateMany({
            where: {
                organizer_id: organizerId,
                status: 'approved',
                end_date: { gte: now },
            },
            data: {
                status: 'cancelled',
                approval_notes: 'Cancelled: organizer account deactivated by admin',
            },
        });
    }
    static async listUsers(page = 1, limit = 10, search, role) {
        const skip = (page - 1) * limit;
        const roleFilter = role && ROLES.includes(role) ? { role } : {};
        const searchWhere = search
            ? {
                OR: [
                    { first_name: { contains: search, mode: 'insensitive' } },
                    { last_name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : undefined;
        const where = {
            ...roleFilter,
            ...(searchWhere ? searchWhere : {}),
        };
        const [users, total] = await Promise.all([
            database_Preetam_1.default.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    role: true,
                    avatar_url: true,
                    is_active: true,
                    is_verified: true,
                    created_at: true,
                },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            database_Preetam_1.default.user.count({ where }),
        ]);
        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getUserById(id) {
        const user = await database_Preetam_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
                avatar_url: true,
                phone: true,
                bio: true,
                is_active: true,
                is_verified: true,
                created_at: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    static async updateUserRole(id, role) {
        const user = await database_Preetam_1.default.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return database_Preetam_1.default.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                role: true,
            },
        });
    }
    static async updateUserStatus(id, isActive) {
        const user = await database_Preetam_1.default.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        const wasActive = user.is_active;
        const updated = await database_Preetam_1.default.user.update({
            where: { id },
            data: { is_active: isActive },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                is_active: true,
                role: true,
            },
        });
        if (wasActive && !isActive) {
            await UserService.revokeAllSessions(id);
            if (user.role === 'organizer') {
                await UserService.withdrawOrganizerPublicEvents(id);
            }
        }
        return updated;
    }
    static async deleteUser(targetId, adminId) {
        if (targetId === adminId) {
            const err = new Error('You cannot delete your own account');
            err.statusCode = 400;
            throw err;
        }
        const user = await database_Preetam_1.default.user.findUnique({ where: { id: targetId } });
        if (!user) {
            throw new Error('User not found');
        }
        const orgEventIds = (await database_Preetam_1.default.event.findMany({
            where: { organizer_id: targetId },
            select: { id: true },
        })).map((e) => e.id);
        await database_Preetam_1.default.$transaction(async (tx) => {
            if (orgEventIds.length > 0) {
                await tx.ticket.deleteMany({ where: { event_id: { in: orgEventIds } } });
                await tx.event.deleteMany({ where: { id: { in: orgEventIds } } });
            }
            await tx.ticket.deleteMany({ where: { user_id: targetId } });
            await tx.rsvp.deleteMany({ where: { user_id: targetId } });
            await tx.eventView.deleteMany({ where: { user_id: targetId } });
            await tx.refreshToken.deleteMany({ where: { user_id: targetId } });
            await tx.event.updateMany({
                where: { approved_by_id: targetId },
                data: { approved_by_id: null },
            });
            await tx.user.delete({ where: { id: targetId } });
        });
        return { id: targetId };
    }
}
exports.UserService = UserService;
