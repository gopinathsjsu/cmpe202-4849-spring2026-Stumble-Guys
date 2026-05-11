import prisma from '../config/database_Preetam';
import { NearbyQuery, MapBoundsQuery } from '../types/search_Pratham';

export class LocationService {
  static async getNearbyEvents(query: NearbyQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const radiusKm = query.radius || 25;

    const events = await prisma.$queryRawUnsafe(
      `SELECT e.*,
        json_build_object('id', u."id", 'first_name', u."first_name", 'last_name', u."last_name", 'avatar_url', u."avatar_url") as organizer,
        CASE WHEN c."id" IS NOT NULL 
          THEN json_build_object('id', c."id", 'name', c."name", 'slug', c."slug")
          ELSE NULL 
        END as category,
        (6371 * acos(
          cos(radians($1)) * cos(radians(e."latitude")) *
          cos(radians(e."longitude") - radians($2)) +
          sin(radians($1)) * sin(radians(e."latitude"))
        )) AS distance_km
      FROM "events" e
      LEFT JOIN "users" u ON e."organizer_id" = u."id"
      LEFT JOIN "categories" c ON e."category_id" = c."id"
      WHERE e."status" = 'approved'
        AND e."latitude" IS NOT NULL
        AND e."longitude" IS NOT NULL
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(e."latitude")) *
          cos(radians(e."longitude") - radians($2)) +
          sin(radians($1)) * sin(radians(e."latitude"))
        )) <= $3
      ORDER BY distance_km ASC
      LIMIT $4 OFFSET $5`,
      query.latitude,
      query.longitude,
      radiusKm,
      limit,
      offset
    );

    return {
      data: events,
      pagination: { page, limit },
    };
  }

  static async getEventsInBounds(bounds: MapBoundsQuery) {
    return prisma.event.findMany({
      where: {
        status: 'approved',
        latitude: { gte: bounds.south, lte: bounds.north },
        longitude: { gte: bounds.west, lte: bounds.east },
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

  static async saveEvent(userId: string, eventId: string) {
    const existing = await prisma.savedEvent.findUnique({
      where: {
        user_id_event_id: { user_id: userId, event_id: eventId },
      },
    });

    if (existing) {
      throw new Error('Event already saved');
    }

    return prisma.savedEvent.create({
      data: {
        user_id: userId,
        event_id: eventId,
      },
    });
  }

  static async unsaveEvent(userId: string, eventId: string) {
    const existing = await prisma.savedEvent.findUnique({
      where: {
        user_id_event_id: { user_id: userId, event_id: eventId },
      },
    });

    if (!existing) {
      throw new Error('Saved event not found');
    }

    return prisma.savedEvent.delete({
      where: {
        user_id_event_id: { user_id: userId, event_id: eventId },
      },
    });
  }

  static async getSavedEvents(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [saved, total] = await Promise.all([
      prisma.savedEvent.findMany({
        where: { user_id: userId },
        include: {
          event: {
            include: {
              organizer: {
                select: { id: true, first_name: true, last_name: true, avatar_url: true },
              },
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.savedEvent.count({ where: { user_id: userId } }),
    ]);

    return {
      data: saved,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getEventStats(eventId: string) {
    const [
      viewCount,
      goingApproved,
      goingPending,
      maybeCount,
      notGoingCount,
      ticketSold,
    ] = await Promise.all([
      prisma.eventView.count({ where: { event_id: eventId } }),
      prisma.rsvp.count({
        where: {
          event_id: eventId,
          status: 'going',
          approval_status: { in: ['approved', 'not_required'] },
        },
      }),
      prisma.rsvp.count({
        where: { event_id: eventId, status: 'going', approval_status: 'pending' },
      }),
      prisma.rsvp.count({ where: { event_id: eventId, status: 'maybe' } }),
      prisma.rsvp.count({ where: { event_id: eventId, status: 'not_going' } }),
      prisma.ticket.count({
        where: { event_id: eventId, status: 'confirmed' },
      }),
    ]);

    return {
      views: viewCount,
      rsvps: {
        going: goingApproved,
        going_pending: goingPending,
        maybe: maybeCount,
        not_going: notGoingCount,
      },
      ticketsSold: ticketSold,
    };
  }
}
