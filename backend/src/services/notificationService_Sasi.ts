import prisma from '../config/database_Preetam';

export class NotificationService {
  static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    eventId?: string,
    channel: string = 'in_app'
  ) {
    return prisma.notification.create({
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

  static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
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
      prisma.notification.count({ where: { user_id: userId } }),
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

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new Error('Not authorized to update this notification');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });
  }
}
