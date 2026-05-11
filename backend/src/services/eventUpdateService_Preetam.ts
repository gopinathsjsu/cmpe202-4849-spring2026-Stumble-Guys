import prisma from '../config/database_Preetam';
import { NotificationService } from './notificationService_Sasi';
import { EmailService } from './emailService_Sasi';

export class EventUpdateService {
  static async list(eventId: string) {
    return prisma.eventUpdate.findMany({
      where: { event_id: eventId },
      include: {
        author: { select: { id: true, first_name: true, last_name: true, role: true } },
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  static async create(input: {
    eventId: string;
    authorId: string;
    authorRole: string;
    message: string;
  }) {
    const msg = input.message.trim();
    if (!msg) {
      const err = new Error('Update message is required');
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }
    if (msg.length > 2000) {
      const err = new Error('Update message is too long');
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }

    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
      select: {
        id: true,
        title: true,
        organizer_id: true,
        status: true,
      },
    });
    if (!event) throw new Error('Event not found');

    const canPost =
      input.authorRole === 'admin' || event.organizer_id === input.authorId;
    if (!canPost) {
      const err = new Error('Not authorized to post updates for this event');
      (err as Error & { statusCode?: number }).statusCode = 403;
      throw err;
    }

    const created = await prisma.eventUpdate.create({
      data: {
        event_id: input.eventId,
        author_id: input.authorId,
        message: msg,
      },
      include: {
        author: { select: { id: true, first_name: true, last_name: true, role: true } },
      },
    });

    // Notify attendees (confirmed tickets OR approved/not_required RSVPs)
    const attendees = await prisma.user.findMany({
      where: {
        OR: [
          { tickets: { some: { event_id: input.eventId, status: 'confirmed' } } },
          {
            rsvps: {
              some: {
                event_id: input.eventId,
                status: 'going',
                approval_status: { in: ['approved', 'not_required'] },
              },
            },
          },
        ],
      },
      select: { id: true, email: true, first_name: true },
    });

    await Promise.all(
      attendees.map(async (u) => {
        await NotificationService.createNotification(
          u.id,
          'event_update_posted',
          'New event update',
          `An update was posted for "${event.title}".`,
          input.eventId
        );
        if (u.email) {
          EmailService.sendEventChangedEmail(u.email, {
            recipientName: u.first_name,
            eventTitle: event.title,
            changeType: 'updated',
          }).catch((e) => console.error('Failed to send update-posted email', e));
        }
      })
    );

    return created;
  }
}

