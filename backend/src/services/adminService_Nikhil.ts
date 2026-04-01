import prisma from '../config/database_Preetam';

export class AdminService {
  static async getPendingEvents(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'pending_approval' },
        include: {
          organizer: {
            select: { id: true, first_name: true, last_name: true, email: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.event.count({ where: { status: 'pending_approval' } }),
    ]);

    return {
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async approveEvent(eventId: string, adminId: string, notes?: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending_approval') {
      throw new Error('Event is not pending approval');
    }

    return prisma.event.update({
      where: { id: eventId },
      data: {
        status: 'approved',
        approved_by: { connect: { id: adminId } },
        approved_at: new Date(),
        approval_notes: notes,
      },
    });
  }

  static async rejectEvent(eventId: string, adminId: string, notes: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending_approval') {
      throw new Error('Event is not pending approval');
    }

    return prisma.event.update({
      where: { id: eventId },
      data: {
        status: 'rejected',
        approved_by: { connect: { id: adminId } },
        approved_at: new Date(),
        approval_notes: notes,
      },
    });
  }

  static async getDashboardStats() {
    const [userCount, eventCount, ticketCount, revenueResult] =
      await Promise.all([
        prisma.user.count(),
        prisma.event.count(),
        prisma.ticket.count(),
        prisma.ticket.aggregate({
          _sum: { amount_paid: true },
          where: { payment_status: 'completed' },
        }),
      ]);

    return {
      totalUsers: userCount,
      totalEvents: eventCount,
      totalTickets: ticketCount,
      totalRevenue: revenueResult._sum.amount_paid || 0,
    };
  }
}
