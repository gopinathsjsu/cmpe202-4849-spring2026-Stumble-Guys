import { z } from 'zod';

export const createTicketTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0).optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
});

export const purchaseTicketSchema = z.object({
  ticket_type_id: z.string().uuid('Invalid ticket type ID'),
  quantity: z.number().int().min(1).max(10, 'Maximum 10 tickets per purchase'),
});

export const rsvpSchema = z.object({
  status: z.enum(['going', 'maybe', 'not_going']),
});
