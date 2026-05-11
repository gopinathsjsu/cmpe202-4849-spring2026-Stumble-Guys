import prisma from '../config/database_Preetam';
import type { Prisma } from '@prisma/client';

const ROLES = ['admin', 'organizer', 'attendee'] as const;

export class UserService {
  static async revokeAllSessions(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { user_id: userId } });
  }

  /** Withdraw upcoming public listings when an organizer is deactivated or removed. */
  static async withdrawOrganizerPublicEvents(organizerId: string) {
    const now = new Date();
    await prisma.event.updateMany({
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
    await prisma.event.updateMany({
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

  static async listUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string
  ) {
    const skip = (page - 1) * limit;

    const roleFilter =
      role && (ROLES as readonly string[]).includes(role) ? { role } : {};

    const searchWhere: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            { first_name: { contains: search, mode: 'insensitive' as const } },
            { last_name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const where: Prisma.UserWhereInput = {
      ...roleFilter,
      ...(searchWhere ? searchWhere : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count({ where }),
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

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
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

  static async updateUserRole(id: string, role: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
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

  static async updateUserStatus(id: string, isActive: boolean) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    const wasActive = user.is_active;

    const updated = await prisma.user.update({
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

  static async deleteUser(targetId: string, adminId: string) {
    if (targetId === adminId) {
      const err = new Error('You cannot delete your own account');
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }

    const user = await prisma.user.findUnique({ where: { id: targetId } });
    if (!user) {
      throw new Error('User not found');
    }

    const orgEventIds = (
      await prisma.event.findMany({
        where: { organizer_id: targetId },
        select: { id: true },
      })
    ).map((e) => e.id);

    await prisma.$transaction(async (tx) => {
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
