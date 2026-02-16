import prisma from '../config/database_Preetam';
import { generateSlug } from '../utils/generateSlug_Nikhil';
import {
  CreateEventInput,
  EventFilters,
} from '../types/event_Nikhil';

export class EventService {
  static async createEvent(organizerId: string, input: CreateEventInput) {
    const slug = generateSlug(input.title);

    return prisma.event.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        short_desc: input.short_desc,
        category_id: input.category_id,
        organizer_id: organizerId,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
        timezone: input.timezone || 'UTC',
        venue_name: input.venue_name,
        address: input.address,
        city: input.city,
        state: input.state,
        zip_code: input.zip_code,
        country: input.country,
        latitude: input.latitude,
        longitude: input.longitude,
        is_online: input.is_online || false,
        online_url: input.online_url,
        image_url: input.image_url,
        capacity: input.capacity,
        is_free: input.is_free ?? true,
        price: input.price,
        tags: input.tags || [],
        schedule: input.schedule ? JSON.parse(JSON.stringify(input.schedule)) : [],
        status: 'draft',
      },
      include: {
        organizer: {
          select: { id: true, first_name: true, last_name: true, avatar_url: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  static async listEvents(
    filters: EventFilters,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'approved' };

    if (filters.category_id) {
      where.category_id = filters.category_id;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: { id: true, first_name: true, last_name: true, avatar_url: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { start_date: 'asc' },
      }),
      prisma.event.count({ where }),
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

  static async getEventBySlug(slug: string) {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: { id: true, first_name: true, last_name: true, avatar_url: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        ticket_types: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  static async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, first_name: true, last_name: true, avatar_url: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        ticket_types: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }
}
