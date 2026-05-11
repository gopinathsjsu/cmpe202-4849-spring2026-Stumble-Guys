import prisma from '../config/database_Preetam';
import { NotificationService } from './notificationService_Sasi';
import { EmailService } from './emailService_Sasi';

const ADMIN_ROLE = 'admin';

function canManageEvent(organizerId: string, requesterId: string, requesterRole: string) {
  return requesterRole === ADMIN_ROLE || organizerId === requesterId;
}

export class RsvpService {
  static async createOrUpdateRsvp(
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going'
  ) {
    const event = await prisma.event.findUnique({
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
        prisma.ticket.count({ where: { event_id: eventId, status: 'confirmed' } }),
        prisma.rsvp.count({
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
        (err as Error & { statusCode?: number }).statusCode = 409;
        throw err;
      }
    }

    const result = await prisma.rsvp.upsert({
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
        prisma.user.findUnique({
          where: { id: result.event.organizer_id },
          select: { id: true, email: true, first_name: true },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { first_name: true, last_name: true },
        }),
      ]);

      if (organizer) {
        await NotificationService.createNotification(
          organizer.id,
          'rsvp_request',
          'New RSVP request',
          `A new RSVP request was received for "${result.event.title}".`,
          eventId
        );

        if (organizer.email) {
          EmailService.sendNewRsvpRequestEmail(organizer.email, {
            organizerName: organizer.first_name,
            eventTitle: result.event.title,
            attendeeName: attendee ? `${attendee.first_name} ${attendee.last_name}`.trim() : undefined,
          }).catch((e) => console.error('Failed to send RSVP request email', e));
        }
      }
    }

    return result;
  }

  static async removeRsvp(eventId: string, userId: string) {
    const rsvp = await prisma.rsvp.findUnique({
      where: {
        event_id_user_id: { event_id: eventId, user_id: userId },
      },
    });

    if (!rsvp) {
      throw new Error('RSVP not found');
    }

    return prisma.rsvp.delete({
      where: {
        event_id_user_id: { event_id: eventId, user_id: userId },
      },
    });
  }

  static async getEventRsvps(
    eventId: string,
    requesterId: string,
    requesterRole: string,
    page: number = 1,
    limit: number = 100
  ) {
    const event = await prisma.event.findUnique({
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
      prisma.rsvp.findMany({
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
      prisma.rsvp.count({ where: { event_id: eventId } }),
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

  static async getUserRsvp(eventId: string, userId: string) {
    return prisma.rsvp.findUnique({
      where: {
        event_id_user_id: { event_id: eventId, user_id: userId },
      },
    });
  }

  static async getRsvpsForUser(userId: string) {
    return prisma.rsvp.findMany({
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

  static async approveRsvp(
    eventId: string,
    rsvpId: string,
    requesterId: string,
    requesterRole: string
  ) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizer_id: true, title: true, capacity: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (!canManageEvent(event.organizer_id, requesterId, requesterRole)) {
      throw new Error('Not authorized to approve RSVPs');
    }

    const rsvp = await prisma.rsvp.findUnique({
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

    const updated = await prisma.$transaction(async (tx) => {
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
          (err as Error & { statusCode?: number }).statusCode = 409;
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

    await NotificationService.createNotification(
      rsvp.user_id,
      'rsvp_approved',
      'RSVP approved',
      `Your request to attend "${event.title}" was approved. You're confirmed!`,
      eventId
    );

    if (updated.user?.email) {
      EmailService.sendRsvpDecisionEmail(updated.user.email, {
        recipientName: updated.user.first_name,
        eventTitle: event.title,
        decision: 'approved',
      }).catch((e) => console.error('Failed to send RSVP decision email', e));
    }

    return updated;
  }

  static async rejectRsvp(
    eventId: string,
    rsvpId: string,
    requesterId: string,
    requesterRole: string
  ) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizer_id: true, title: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (!canManageEvent(event.organizer_id, requesterId, requesterRole)) {
      throw new Error('Not authorized to reject RSVPs');
    }

    const rsvp = await prisma.rsvp.findUnique({
      where: { id: rsvpId },
    });

    if (!rsvp || rsvp.event_id !== eventId) {
      throw new Error('RSVP not found');
    }

    if (rsvp.status !== 'going' || rsvp.approval_status !== 'pending') {
      throw new Error('Only pending Going RSVPs can be rejected');
    }

    const updated = await prisma.rsvp.update({
      where: { id: rsvpId },
      data: { approval_status: 'rejected' },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, avatar_url: true, email: true },
        },
      },
    });

    await NotificationService.createNotification(
      rsvp.user_id,
      'rsvp_rejected',
      'RSVP update',
      `Your request to attend "${event.title}" was not approved by the organizer.`,
      eventId
    );

    const attendee = await prisma.user.findUnique({
      where: { id: rsvp.user_id },
      select: { email: true, first_name: true },
    });
    if (attendee?.email) {
      EmailService.sendRsvpDecisionEmail(attendee.email, {
        recipientName: attendee.first_name,
        eventTitle: event.title,
        decision: 'rejected',
      }).catch((e) => console.error('Failed to send RSVP decision email', e));
    }

    return updated;
  }
}
