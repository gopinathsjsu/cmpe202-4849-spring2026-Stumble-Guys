import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_free: z.coerce.boolean().optional(),
  page: z.coerce.number().int().default(1),
  limit: z.coerce.number().int().default(20),
  sort_by: z.string().optional(),
});

export const nearbyQuerySchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  radius: z.coerce.number().default(25),
  page: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
});

export const mapBoundsSchema = z.object({
  north: z.coerce.number(),
  south: z.coerce.number(),
  east: z.coerce.number(),
  west: z.coerce.number(),
});
