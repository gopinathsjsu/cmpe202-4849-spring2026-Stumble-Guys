import prisma from '../config/database_Preetam';
import { NotificationService } from './notificationService_Sasi';
import { EmailService } from './emailService_Sasi';

const MODERATION_STATUSES = ['pending_approval', 'approved', 'rejected'] as const;

export class AdminService {
  static async getModerationQueue(
    page: number = 1,
    limit: number = 10,
    status: string = 'pending_approval'
  ) {
    const resolvedStatus = MODERATION_STATUSES.includes(
      status as (typeof MODERATION_STATUSES)[number]
    )
      ? status
      : 'pending_approval';

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
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
      prisma.event.count({ where: { status: resolvedStatus } }),
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

  static async approveEvent(eventId: string, adminId: string, notes?: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: { select: { id: true, email: true, first_name: true } } },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending_approval') {
      throw new Error('Event is not pending approval');
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: 'approved',
        approved_by: { connect: { id: adminId } },
        approved_at: new Date(),
        approval_notes: notes,
      },
    });

    // In-app + email for organizer (best-effort email)
    await NotificationService.createNotification(
      event.organizer_id,
      'event_approved',
      'Event approved',
      `"${event.title}" was approved and is now live.${notes ? ` Admin notes: ${notes}` : ''}`,
      eventId
    );
    if (event.organizer?.email) {
      EmailService.sendApprovalNotification(event.organizer.email, event.title, 'approved', notes).catch(
        (e) => console.error('Failed to send approval email', e)
      );
    }

    return updated;
  }

  static async rejectEvent(eventId: string, adminId: string, notes: string) {
    const reason = notes?.trim();
    if (!reason) {
      const err = new Error('Reason for rejection is required');
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: { select: { id: true, email: true, first_name: true } } },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending_approval') {
      throw new Error('Event is not pending approval');
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: 'rejected',
        approved_by: { connect: { id: adminId } },
        approved_at: new Date(),
        approval_notes: reason,
      },
    });

    await NotificationService.createNotification(
      event.organizer_id,
      'event_rejected',
      'Event rejected',
      `"${event.title}" was rejected. ${reason ? `Admin notes: ${reason}` : ''}`.trim(),
      eventId
    );
    if (event.organizer?.email) {
      EmailService.sendApprovalNotification(event.organizer.email, event.title, 'rejected', reason).catch(
        (e) => console.error('Failed to send rejection email', e)
      );
    }

    return updated;
  }

  static async getDashboardStats() {
    const [
      totalRegisteredUsers,
      totalActiveUsers,
      totalEventsCreated,
      totalRsvpsProcessed,
      pendingModerationCount,
      confirmedTickets,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.event.count(),
      prisma.rsvp.count(),
      prisma.event.count({ where: { status: 'pending_approval' } }),
      prisma.ticket.count({ where: { status: 'confirmed' } }),
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
