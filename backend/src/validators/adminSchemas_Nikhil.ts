import { z } from 'zod';

export const rejectEventBodySchema = z.object({
  notes: z.string().trim().min(1, 'Reason for rejection is required'),
});

export const categoryBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  icon: z.string().trim().max(64).optional().nullable(),
});
