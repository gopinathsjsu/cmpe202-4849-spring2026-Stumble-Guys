import { z } from 'zod';

export const purchaseTicketsSchema = z.object({
  ticket_type_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
});

export const rsvpSchema = z.object({
  status: z.enum(['going', 'interested', 'not_going']).default('going'),
});

