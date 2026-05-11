"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const generateTicketNumber_Sasi_1 = require("../utils/generateTicketNumber_Sasi");
const emailService_Sasi_1 = require("./emailService_Sasi");
class TicketService {
    static async createTicketType(eventId, organizerId, input) {
        const event = await database_Preetam_1.default.event.findUnique({ where: { id: eventId } });
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.organizer_id !== organizerId) {
            throw new Error('Not authorized to create ticket types for this event');
        }
        return database_Preetam_1.default.ticketType.create({
            data: {
                event_id: eventId,
                name: input.name,
                price: input.price || 0,
                quantity: input.quantity,
                description: input.description,
            },
        });
    }
    static async getTicketTypes(eventId) {
        return database_Preetam_1.default.ticketType.findMany({
            where: { event_id: eventId },
            orderBy: { price: 'asc' },
        });
    }
    static async purchaseTicket(userId, eventId, input) {
        const tickets = (await database_Preetam_1.default.$transaction(async (tx) => {
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
                throw new Error(`Only ${available} ticket(s) remaining`);
            }
            await tx.ticketType.update({
                where: { id: input.ticket_type_id },
                data: { sold_count: { increment: input.quantity } },
            });
            const tickets = [];
            for (let i = 0; i < input.quantity; i++) {
                const ticket = await tx.ticket.create({
                    data: {
                        ticket_number: (0, generateTicketNumber_Sasi_1.generateTicketNumber)(),
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
        }));
        // Email confirmation (best-effort; do not fail purchase)
        try {
            const user = await database_Preetam_1.default.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });
            const first = tickets[0];
            if (user?.email && first) {
                await emailService_Sasi_1.EmailService.sendTicketConfirmation(user.email, {
                    ticketNumber: first.ticket_number,
                    eventTitle: first.event.title,
                    eventDate: first.event.start_date ? first.event.start_date.toISOString() : 'TBA',
                    venue: first.event.venue_name ?? 'TBA',
                    ticketType: first.ticket_type.name,
                    quantity: input.quantity,
                    totalAmount: Number(first.ticket_type.price ?? 0) * input.quantity,
                });
            }
        }
        catch (e) {
            console.error('Failed to send ticket confirmation email', e);
        }
        return tickets;
    }
    static async getMyTickets(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [tickets, total] = await Promise.all([
            database_Preetam_1.default.ticket.findMany({
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
                orderBy: { created_at: 'desc' },
            }),
            database_Preetam_1.default.ticket.count({ where: { user_id: userId } }),
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
    static async getTicketById(ticketId, userId) {
        const ticket = await database_Preetam_1.default.ticket.findUnique({
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
    static async cancelTicket(ticketId, userId) {
        const ticket = await database_Preetam_1.default.ticket.findUnique({
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
        return database_Preetam_1.default.$transaction(async (tx) => {
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
exports.TicketService = TicketService;
