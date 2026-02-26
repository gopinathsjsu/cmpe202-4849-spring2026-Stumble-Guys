import prisma from '../config/database_Preetam';
import { generateSlug } from '../utils/generateSlug_Nikhil';
import {
  CreateEventInput,
  UpdateEventInput,
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

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.start_date || filters.end_date) {
      where.start_date = {};
      if (filters.start_date) {
        (where.start_date as Record<string, unknown>).gte = new Date(filters.start_date);
      }
      if (filters.end_date) {
        (where.start_date as Record<string, unknown>).lte = new Date(filters.end_date);
      }
    }

    if (filters.is_free !== undefined) {
      where.is_free = filters.is_free;
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

  static async updateEvent(
    id: string,
    organizerId: string,
    input: UpdateEventInput
  ) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to update this event');
    }

    const data: Record<string, unknown> = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.short_desc !== undefined) data.short_desc = input.short_desc;
    if (input.category_id !== undefined) data.category_id = input.category_id;
    if (input.start_date !== undefined) data.start_date = new Date(input.start_date);
    if (input.end_date !== undefined) data.end_date = new Date(input.end_date);
    if (input.timezone !== undefined) data.timezone = input.timezone;
    if (input.venue_name !== undefined) data.venue_name = input.venue_name;
    if (input.address !== undefined) data.address = input.address;
    if (input.city !== undefined) data.city = input.city;
    if (input.state !== undefined) data.state = input.state;
    if (input.zip_code !== undefined) data.zip_code = input.zip_code;
    if (input.country !== undefined) data.country = input.country;
    if (input.latitude !== undefined) data.latitude = input.latitude;
    if (input.longitude !== undefined) data.longitude = input.longitude;
    if (input.is_online !== undefined) data.is_online = input.is_online;
    if (input.online_url !== undefined) data.online_url = input.online_url;
    if (input.image_url !== undefined) data.image_url = input.image_url;
    if (input.capacity !== undefined) data.capacity = input.capacity;
    if (input.is_free !== undefined) data.is_free = input.is_free;
    if (input.price !== undefined) data.price = input.price;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.schedule !== undefined) {
      data.schedule = JSON.parse(JSON.stringify(input.schedule));
    }

    return prisma.event.update({
      where: { id },
      data,
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

  static async deleteEvent(id: string, organizerId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to delete this event');
    }

    return prisma.event.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  static async getEventsByOrganizer(
    organizerId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { organizer_id: organizerId },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.event.count({ where: { organizer_id: organizerId } }),
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

  static async submitForApproval(id: string, organizerId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to submit this event');
    }

    return prisma.event.update({
      where: { id },
      data: { status: 'pending_approval' },
    });
  }

  static async getAttendees(eventId: string, organizerId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to view attendees');
    }

    return prisma.ticket.findMany({
      where: { event_id: eventId, status: 'confirmed' },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true, avatar_url: true },
        },
        ticket_type: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { purchase_date: 'desc' },
    });
  }
}
