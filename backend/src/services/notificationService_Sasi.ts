import prisma from '../config/database_Preetam';

export class NotificationService {
  static async listMyNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { sent_at: 'desc' },
      take: 50,
    });
  }

  static async createNotification(input: {
    user_id: string;
    event_id?: string | null;
    type: string;
    title: string;
    message: string;
    channel?: string;
  }) {
    return prisma.notification.create({
      data: {
        user_id: input.user_id,
        event_id: input.event_id ?? null,
        type: input.type,
        title: input.title,
        message: input.message,
        channel: input.channel ?? 'in_app',
      },
    });
  }

  static async markAsRead(userId: string, notificationId: string) {
    const n = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!n || n.user_id !== userId) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
  }
}

