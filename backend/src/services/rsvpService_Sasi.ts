import prisma from '../config/database_Preetam';

export class RsvpService {
  static async upsertRsvp(eventId: string, userId: string, status: string) {
    return prisma.rsvp.upsert({
      where: {
        event_id_user_id: {
          event_id: eventId,
          user_id: userId,
        },
      },
      create: { event_id: eventId, user_id: userId, status },
      update: { status },
    });
  }
}

