import prisma from '../config/database_Preetam';
import { generateSlug } from '../utils/generateSlug_Nikhil';
import {
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
} from '../types/event_Nikhil';
import { NotificationService } from './notificationService_Sasi';
import { EmailService } from './emailService_Sasi';
import { parseGoogleMapsLatLng } from '../utils/googleMapsUrl_Nikhil';

async function notifyAdminsEventPendingApproval(input: {
  eventId: string;
  eventTitle: string;
  organizerName?: string;
}) {
  const admins = await prisma.user.findMany({
    where: { role: 'admin', is_active: true },
    select: { id: true, email: true, first_name: true },
  });

  await Promise.all(
    admins.map(async (admin) => {
      await NotificationService.createNotification(
        admin.id,
        'event_pending_approval',
        'New event pending approval',
        `"${input.eventTitle}" is awaiting review.`,
        input.eventId
      );

      if (admin.email) {
        EmailService.sendAdminNewEventPendingEmail(admin.email, {
          adminName: admin.first_name,
          eventTitle: input.eventTitle,
          organizerName: input.organizerName,
        }).catch((e) => console.error('Failed to send admin pending email', e));
      }
    })
  );
}

export class EventService {
  static async createEvent(organizerId: string, input: CreateEventInput) {
    const slug = generateSlug(input.title);
    const parsedLatLng =
      input.google_maps_url && (!input.latitude || !input.longitude)
        ? parseGoogleMapsLatLng(input.google_maps_url)
        : null;

    const created = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
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
          latitude: input.latitude ?? parsedLatLng?.latitude,
          longitude: input.longitude ?? parsedLatLng?.longitude,
          google_maps_url: input.google_maps_url || undefined,
          is_online: input.is_online || false,
          online_url: input.online_url,
          image_url: input.image_url,
          capacity: input.capacity,
          is_free: input.is_free ?? true,
          price: input.price,
          tags: input.tags || [],
          schedule: input.schedule ? JSON.parse(JSON.stringify(input.schedule)) : [],
          status: 'pending_approval',
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

      // For paid events, create a default ticket tier so attendees can purchase.
      if (event.is_free === false) {
        await tx.ticketType.create({
          data: {
            event_id: event.id,
            name: 'General Admission',
            price: event.price ?? 0,
            quantity: event.capacity ?? 0,
            description: 'Default ticket tier',
          },
        });
      }

      return event;
    });

    // Notify admins about new moderation item (best-effort emails, in-app always)
    notifyAdminsEventPendingApproval({
      eventId: created.id,
      eventTitle: created.title,
      organizerName: [created.organizer?.first_name, created.organizer?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim() || undefined,
    }).catch((e) => console.error('Failed to notify admins for pending event', e));

    return created;
  }

  static async listEvents(
    filters: EventFilters,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'approved' };

    if (filters.category_ids?.length) {
      where.category_id =
        filters.category_ids.length === 1
          ? filters.category_ids[0]
          : { in: filters.category_ids };
    } else if (filters.category_id) {
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

  static async getEventBySlug(slug: string, requester?: { userId: string; role: string }) {
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
        _count: {
          select: {
            rsvps: {
              where: {
                status: 'going',
                approval_status: { in: ['approved', 'not_required'] },
              },
            },
            tickets: {
              where: { status: 'confirmed' },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // For attendee-facing pages, only approved events should be visible.
    // Organizers/admins can still access their own events via organizer/admin screens.
    if (event.status !== 'approved') {
      const isAdmin = requester?.role === 'admin';
      const isOwner = requester?.role === 'organizer' && requester.userId === event.organizer_id;
      if (isAdmin || isOwner) return event;
      const err = new Error('Event not found');
      (err as Error & { statusCode?: number }).statusCode = 404;
      throw err;
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
    if (input.google_maps_url !== undefined) data.google_maps_url = input.google_maps_url || null;
    if (input.latitude !== undefined) data.latitude = input.latitude;
    if (input.longitude !== undefined) data.longitude = input.longitude;
    if (
      input.google_maps_url &&
      input.latitude === undefined &&
      input.longitude === undefined
    ) {
      const parsed = parseGoogleMapsLatLng(input.google_maps_url);
      if (parsed) {
        data.latitude = parsed.latitude;
        data.longitude = parsed.longitude;
      }
    }
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

    const updated = await prisma.event.update({
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

    // Notify confirmed/approved attendees about updates (in-app + best-effort email)
    const attendeeRows = await prisma.user.findMany({
      where: {
        OR: [
          { tickets: { some: { event_id: id, status: 'confirmed' } } },
          {
            rsvps: {
              some: {
                event_id: id,
                status: 'going',
                approval_status: { in: ['approved', 'not_required'] },
              },
            },
          },
        ],
      },
      select: { id: true, email: true, first_name: true },
    });

    await Promise.all(
      attendeeRows.map(async (u) => {
        await NotificationService.createNotification(
          u.id,
          'event_updated',
          'Event updated',
          `"${updated.title}" has been updated.`,
          id
        );
        if (u.email) {
          EmailService.sendEventChangedEmail(u.email, {
            recipientName: u.first_name,
            eventTitle: updated.title,
            changeType: 'updated',
            organizerName: [updated.organizer?.first_name, updated.organizer?.last_name]
              .filter(Boolean)
              .join(' ')
              .trim() || undefined,
          }).catch((e) => console.error('Failed to send event update email', e));
        }
      })
    );

    return updated;
  }

  static async deleteEvent(id: string, requesterId: string, requesterRole?: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error('Event not found');
    }

    const isAdmin = requesterRole === 'admin';
    if (!isAdmin && event.organizer_id !== requesterId) {
      throw new Error('Not authorized to delete this event');
    }

    const cancelled = await prisma.event.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    const attendeeRows = await prisma.user.findMany({
      where: {
        OR: [
          { tickets: { some: { event_id: id, status: 'confirmed' } } },
          {
            rsvps: {
              some: {
                event_id: id,
                status: 'going',
                approval_status: { in: ['approved', 'not_required'] },
              },
            },
          },
        ],
      },
      select: { id: true, email: true, first_name: true },
    });

    await Promise.all(
      attendeeRows.map(async (u) => {
        await NotificationService.createNotification(
          u.id,
          'event_cancelled',
          'Event cancelled',
          `"${cancelled.title}" was cancelled.`,
          id
        );
        if (u.email) {
          EmailService.sendEventChangedEmail(u.email, {
            recipientName: u.first_name,
            eventTitle: cancelled.title,
            changeType: 'cancelled',
          }).catch((e) => console.error('Failed to send event cancelled email', e));
        }
      })
    );

    return cancelled;
  }

  static async getEventsByOrganizer(
    organizerId: string,
    filters?: { status?: string },
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    const status = filters?.status;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { organizer_id: organizerId, ...(status ? { status } : {}) },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: {
              tickets: { where: { status: 'confirmed' } },
              rsvps: {
                where: {
                  status: 'going',
                  approval_status: { in: ['approved', 'not_required'] },
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.event.count({
        where: { organizer_id: organizerId, ...(status ? { status } : {}) },
      }),
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

    const updated = await prisma.event.update({
      where: { id },
      data: { status: 'pending_approval' },
    });

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      select: { first_name: true, last_name: true },
    });
    notifyAdminsEventPendingApproval({
      eventId: updated.id,
      eventTitle: updated.title,
      organizerName: organizer
        ? `${organizer.first_name ?? ''} ${organizer.last_name ?? ''}`.trim() || undefined
        : undefined,
    }).catch((e) => console.error('Failed to notify admins for submitted event', e));

    return updated;
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

  static async getOrganizerDashboard(organizerId: string) {
    const now = new Date();

    const [
      totalActiveEvents,
      pendingAdminApproval,
      ticketAttendeeCount,
      rsvpApprovedCount,
      pendingRsvpRequests,
      upcomingEvents,
      notifPage,
    ] = await Promise.all([
      prisma.event.count({
        where: {
          organizer_id: organizerId,
          status: 'approved',
          end_date: { gte: now },
        },
      }),
      prisma.event.count({
        where: { organizer_id: organizerId, status: 'pending_approval' },
      }),
      prisma.ticket.count({
        where: {
          status: 'confirmed',
          event: { organizer_id: organizerId },
        },
      }),
      prisma.rsvp.count({
        where: {
          status: 'going',
          approval_status: { in: ['approved', 'not_required'] },
          event: { organizer_id: organizerId },
        },
      }),
      prisma.rsvp.count({
        where: {
          status: 'going',
          approval_status: 'pending',
          event: { organizer_id: organizerId },
        },
      }),
      prisma.event.findMany({
        where: {
          organizer_id: organizerId,
          status: 'approved',
          start_date: { gte: now },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          start_date: true,
          end_date: true,
          city: true,
          venue_name: true,
          is_free: true,
        },
        orderBy: { start_date: 'asc' },
        take: 5,
      }),
      NotificationService.getUserNotifications(organizerId, 1, 8),
    ]);

    return {
      metrics: {
        totalActiveEvents,
        pendingAdminApproval,
        totalApprovedAttendees: ticketAttendeeCount + rsvpApprovedCount,
        pendingRsvpRequests,
      },
      upcomingEvents,
      recentNotifications: notifPage.data,
    };
  }

  static async getOrganizerPendingRsvps(organizerId: string) {
    const ownedEvents = await prisma.event.findMany({
      where: { organizer_id: organizerId },
      select: { id: true },
    });
    const eventIds = ownedEvents.map((e) => e.id);
    if (eventIds.length === 0) {
      return [];
    }

    return prisma.rsvp.findMany({
      where: {
        event_id: { in: eventIds },
        status: 'going',
        approval_status: 'pending',
      },
      include: {
        event: { select: { id: true, title: true, slug: true } },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            bio: true,
            phone: true,
            avatar_url: true,
            created_at: true,
            is_verified: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async getEventGuestlist(eventId: string, organizerId: string, search?: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizer_id !== organizerId) {
      throw new Error('Not authorized to view guestlist');
    }

    const q = search?.trim();
    const userSearch = q
      ? {
          OR: [
            { first_name: { contains: q, mode: 'insensitive' as const } },
            { last_name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [tickets, rsvps] = await Promise.all([
      prisma.ticket.findMany({
        where: {
          event_id: eventId,
          status: 'confirmed',
          ...(userSearch ? { user: userSearch } : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              bio: true,
              phone: true,
              avatar_url: true,
            },
          },
          ticket_type: { select: { id: true, name: true } },
        },
        orderBy: { purchase_date: 'desc' },
      }),
      prisma.rsvp.findMany({
        where: {
          event_id: eventId,
          status: 'going',
          approval_status: { in: ['approved', 'not_required'] },
          ...(userSearch ? { user: userSearch } : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              bio: true,
              phone: true,
              avatar_url: true,
            },
          },
        },
        orderBy: { updated_at: 'desc' },
      }),
    ]);

    return {
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        start_date: event.start_date,
      },
      tickets,
      rsvps,
    };
  }
}
