import prisma from '../config/database_Preetam';
import { SearchQuery } from '../types/search_Pratham';

export class SearchService {
  static async searchEvents(query: SearchQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = [`"status" = 'approved'`];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (query.q) {
      conditions.push(
        `(to_tsvector('english', "title" || ' ' || "description" || ' ' || COALESCE("city", ''))
          @@ to_tsquery('english', $${paramIndex}))`
      );
      const tsQuery = query.q
        .trim()
        .split(/\s+/)
        .join(' & ');
      params.push(tsQuery);
      paramIndex++;
    }

    if (query.category) {
      conditions.push(`"category_id" = $${paramIndex}`);
      params.push(query.category);
      paramIndex++;
    }

    if (query.city) {
      conditions.push(`LOWER("city") = LOWER($${paramIndex})`);
      params.push(query.city);
      paramIndex++;
    }

    if (query.start_date) {
      conditions.push(`"start_date" >= $${paramIndex}`);
      params.push(new Date(query.start_date));
      paramIndex++;
    }

    if (query.end_date) {
      conditions.push(`"start_date" <= $${paramIndex}`);
      params.push(new Date(query.end_date));
      paramIndex++;
    }

    if (query.is_free !== undefined) {
      conditions.push(`"is_free" = $${paramIndex}`);
      params.push(query.is_free);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    let orderBy = `"start_date" ASC`;
    if (query.sort_by === 'date_desc') orderBy = `"start_date" DESC`;
    if (query.sort_by === 'title') orderBy = `"title" ASC`;
    if (query.sort_by === 'newest') orderBy = `"created_at" DESC`;

    const countQuery = `SELECT COUNT(*)::int as total FROM "events" WHERE ${whereClause}`;
    const countResult = (await prisma.$queryRawUnsafe(countQuery, ...params)) as [
      { total: number },
    ];
    const total = countResult[0]?.total || 0;

    const dataQuery = `
      SELECT e.*, 
        json_build_object('id', u."id", 'first_name', u."first_name", 'last_name', u."last_name", 'avatar_url', u."avatar_url") as organizer,
        CASE WHEN c."id" IS NOT NULL 
          THEN json_build_object('id', c."id", 'name', c."name", 'slug', c."slug")
          ELSE NULL 
        END as category
      FROM "events" e
      LEFT JOIN "users" u ON e."organizer_id" = u."id"
      LEFT JOIN "categories" c ON e."category_id" = c."id"
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const events = await prisma.$queryRawUnsafe(dataQuery, ...params);

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

  static async getTrendingEvents(limit: number = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const events = await prisma.$queryRawUnsafe(
      `SELECT e.*, COUNT(ev."id")::int as view_count,
        json_build_object('id', u."id", 'first_name', u."first_name", 'last_name', u."last_name", 'avatar_url', u."avatar_url") as organizer,
        CASE WHEN c."id" IS NOT NULL 
          THEN json_build_object('id', c."id", 'name', c."name", 'slug', c."slug")
          ELSE NULL 
        END as category
      FROM "events" e
      LEFT JOIN "event_views" ev ON e."id" = ev."event_id" AND ev."viewed_at" >= $1
      LEFT JOIN "users" u ON e."organizer_id" = u."id"
      LEFT JOIN "categories" c ON e."category_id" = c."id"
      WHERE e."status" = 'approved'
      GROUP BY e."id", u."id", c."id"
      ORDER BY view_count DESC
      LIMIT $2`,
      sevenDaysAgo,
      limit
    );

    return events;
  }

  static async recordView(
    eventId: string,
    userId?: string,
    ipAddress?: string
  ) {
    return prisma.eventView.create({
      data: {
        event_id: eventId,
        user_id: userId,
        ip_address: ipAddress,
      },
    });
  }
}

// Trending events support added - Sprint 4

// Performance optimizations: query caching and index hints - Sprint 6
