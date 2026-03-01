import prisma from '../config/database_Preetam';
import { generateTicketNumber } from '../utils/generateTicketNumber_Sasi';
import type { PurchaseTicketInput } from '../types/ticket_Sasi';

export class TicketService {
  static async purchaseTickets(eventId: string, userId: string, input: PurchaseTicketInput) {
    const quantity = Math.max(1, Math.floor(input.quantity || 1));

    return prisma.$transaction(async (tx) => {
      const ticketType = await tx.ticketType.findUnique({
        where: { id: input.ticket_type_id },
      });

      if (!ticketType || ticketType.event_id !== eventId) {
        throw new Error('Invalid ticket type');
      }

      const remaining = ticketType.quantity - ticketType.sold_count;
      if (remaining < quantity) {
        throw new Error('Not enough tickets remaining');
      }

      await tx.ticketType.update({
        where: { id: ticketType.id },
        data: { sold_count: { increment: quantity } },
      });

      const created = await Promise.all(
        Array.from({ length: quantity }).map(() =>
          tx.ticket.create({
            data: {
              ticket_type_id: ticketType.id,
              event_id: eventId,
              user_id: userId,
              ticket_number: generateTicketNumber(),
              amount_paid: ticketType.price,
              payment_status: 'completed',
              status: 'confirmed',
            },
          })
        )
      );

      return { ticketType, tickets: created };
    });
  }
}

