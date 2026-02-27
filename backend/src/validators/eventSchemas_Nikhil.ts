import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_desc: z.string().optional(),
  start_date: z.union([z.string(), z.date()]),
  end_date: z.union([z.string(), z.date()]),
  venue_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_online: z.boolean().optional(),
  online_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  capacity: z.number().int().min(1).optional(),
  is_free: z.boolean().optional(),
  price: z.number().min(0).optional(),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  schedule: z.array(z.object({
    title: z.string(),
    start_time: z.string(),
    end_time: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const approvalSchema = z.object({
  notes: z.string().optional(),
});
