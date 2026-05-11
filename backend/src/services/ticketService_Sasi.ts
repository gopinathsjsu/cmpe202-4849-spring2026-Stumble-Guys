import { Prisma } from '@prisma/client';
import prisma from '../config/database_Preetam';
import { generateTicketNumber } from '../utils/generateTicketNumber_Sasi';
import { EmailService } from './emailService_Sasi';
import {
  CreateTicketTypeInput,
  PurchaseTicketInput,
} from '../types/ticket_Sasi';

export class TicketService {
  static async createTicketType(
    eventId: string,
    organizerId: string,
    input: CreateTicketTypeInput
  ) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to create ticket types for this event');
    }

    return prisma.ticketType.create({
      data: {
        event_id: eventId,
        name: input.name,
        price: input.price || 0,
        quantity: input.quantity,
        description: input.description,
      },
    });
  }

  static async getTicketTypes(eventId: string) {
    return prisma.ticketType.findMany({
      where: { event_id: eventId },
      orderBy: { price: 'asc' },
    });
  }

  static async purchaseTicket(
    userId: string,
    eventId: string,
    input: PurchaseTicketInput
  ) {
    const tickets = (await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const ticketType = await tx.ticketType.findUnique({
        where: { id: input.ticket_type_id },
      });

      if (!ticketType) {
        throw new Error('Ticket type not found');
      }

      if (ticketType.event_id !== eventId) {
        throw new Error('Ticket type does not belong to this event');
      }

      const available = ticketType.quantity - ticketType.sold_count;
      if (available < input.quantity) {
        throw new Error(
          `Only ${available} ticket(s) remaining`
        );
      }

      await tx.ticketType.update({
        where: { id: input.ticket_type_id },
        data: { sold_count: { increment: input.quantity } },
      });

      const tickets: unknown[] = [];
      for (let i = 0; i < input.quantity; i++) {
        const ticket = await tx.ticket.create({
          data: {
            ticket_number: generateTicketNumber(),
            user_id: userId,
            event_id: eventId,
            ticket_type_id: input.ticket_type_id,
            status: 'confirmed',
            amount_paid: ticketType.price,
            payment_status: Number(ticketType.price) > 0 ? 'completed' : 'free',
            purchase_date: new Date(),
          },
          include: {
            event: {
              select: { id: true, title: true, start_date: true, venue_name: true },
            },
            ticket_type: {
              select: { id: true, name: true, price: true },
            },
          },
        });
        tickets.push(ticket);
      }

      await tx.notification.create({
        data: {
          user_id: userId,
          type: 'ticket_confirmation',
          title: 'Ticket Purchased',
          message: `You have successfully purchased ${input.quantity} ticket(s) for the event.`,
          event_id: eventId,
          channel: 'in_app',
        },
      });

      return tickets;
    })) as Array<{
      ticket_number: string;
      event: { title: string; start_date: Date | null; venue_name: string | null };
      ticket_type: { name: string; price: number | null };
    }>;

    // Email confirmation (best-effort; do not fail purchase)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      const first = tickets[0];
      if (user?.email && first) {
        await EmailService.sendTicketConfirmation(user.email, {
          ticketNumber: first.ticket_number,
          eventTitle: first.event.title,
          eventDate: first.event.start_date ? first.event.start_date.toISOString() : 'TBA',
          venue: first.event.venue_name ?? 'TBA',
          ticketType: first.ticket_type.name,
          quantity: input.quantity,
          totalAmount: Number(first.ticket_type.price ?? 0) * input.quantity,
        });
      }
    } catch (e) {
      console.error('Failed to send ticket confirmation email', e);
    }

    return tickets;
  }

  static async getMyTickets(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: { user_id: userId },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              start_date: true,
              end_date: true,
              venue_name: true,
              image_url: true,
            },
          },
          ticket_type: {
            select: { id: true, name: true, price: true },
          },
        },
        skip,
        take: limit,
        orderBy: { purchase_date: 'desc' },
      }),
      prisma.ticket.count({ where: { user_id: userId } }),
    ]);

    return {
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTicketById(ticketId: string, userId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            start_date: true,
            end_date: true,
            venue_name: true,
            address: true,
            city: true,
            image_url: true,
          },
        },
        ticket_type: {
          select: { id: true, name: true, price: true },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.user_id !== userId) {
      throw new Error('Not authorized to view this ticket');
    }

    return ticket;
  }

  static async cancelTicket(ticketId: string, userId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.user_id !== userId) {
      throw new Error('Not authorized to cancel this ticket');
    }

    if (ticket.status === 'cancelled') {
      throw new Error('Ticket is already cancelled');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: 'cancelled',
          payment_status: 'refunded',
        },
      });

      await tx.ticketType.update({
        where: { id: ticket.ticket_type_id },
        data: { sold_count: { decrement: 1 } },
      });

      return updated;
    });
  }
}
