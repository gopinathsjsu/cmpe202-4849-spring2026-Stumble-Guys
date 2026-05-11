"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
class SearchService {
    static async searchEvents(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;
        const conditions = [`"status" = 'approved'`];
        const params = [];
        let paramIndex = 1;
        if (query.q) {
            conditions.push(`(to_tsvector('english', "title" || ' ' || "description" || ' ' || COALESCE("city", ''))
          @@ to_tsquery('english', $${paramIndex}))`);
            const tsQuery = query.q
                .trim()
                .split(/\s+/)
                .join(' & ');
            params.push(tsQuery);
            paramIndex++;
        }
        if (query.category) {
            const catIds = query.category
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (catIds.length === 1) {
                conditions.push(`"category_id" = $${paramIndex}`);
                params.push(catIds[0]);
                paramIndex++;
            }
            else if (catIds.length > 1) {
                const ph = catIds.map((_, i) => `$${paramIndex + i}`).join(', ');
                conditions.push(`"category_id" IN (${ph})`);
                params.push(...catIds);
                paramIndex += catIds.length;
            }
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
        if (query.sort_by === 'date_desc')
            orderBy = `"start_date" DESC`;
        if (query.sort_by === 'title')
            orderBy = `"title" ASC`;
        if (query.sort_by === 'newest')
            orderBy = `"created_at" DESC`;
        const countQuery = `SELECT COUNT(*)::int as total FROM "events" WHERE ${whereClause}`;
        const countResult = (await database_Preetam_1.default.$queryRawUnsafe(countQuery, ...params));
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
        const events = await database_Preetam_1.default.$queryRawUnsafe(dataQuery, ...params);
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
    static async getTrendingEvents(limit = 10) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const events = await database_Preetam_1.default.$queryRawUnsafe(`SELECT e.*, COUNT(ev."id")::int as view_count,
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
      LIMIT $2`, sevenDaysAgo, limit);
        return events;
    }
    static async recordView(eventId, userId, ipAddress) {
        return database_Preetam_1.default.eventView.create({
            data: {
                event_id: eventId,
                user_id: userId,
                ip_address: ipAddress,
            },
        });
    }
}
exports.SearchService = SearchService;
