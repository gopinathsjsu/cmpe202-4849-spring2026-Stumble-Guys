"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
exports.getTrending = getTrending;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const searchService_Pratham_1 = require("../services/searchService_Pratham");
function parseCategoryFromQuery(q) {
    const keys = ['category_ids', 'category_id', 'category', 'categories'];
    const ids = [];
    for (const key of keys) {
        const v = q[key];
        if (v == null)
            continue;
        if (Array.isArray(v)) {
            for (const item of v) {
                const s = String(item).trim();
                if (!s)
                    continue;
                ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
            }
        }
        else {
            const s = String(v).trim();
            if (!s)
                continue;
            ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
        }
    }
    const unique = [...new Set(ids)];
    return unique.length ? unique.join(',') : undefined;
}
async function search(req, res) {
    try {
        const q = req.query;
        const isFreeRaw = q.is_free;
        let isFreeParsed;
        if (isFreeRaw !== undefined && isFreeRaw !== '') {
            const s = Array.isArray(isFreeRaw)
                ? String(isFreeRaw[0]).toLowerCase()
                : String(isFreeRaw).toLowerCase();
            if (s === 'true')
                isFreeParsed = true;
            else if (s === 'false')
                isFreeParsed = false;
        }
        const params = {
            q: q.q,
            category: parseCategoryFromQuery(q),
            city: q.city,
            start_date: q.start_date,
            end_date: q.end_date,
            is_free: isFreeParsed,
            page: q.page != null ? Number(q.page) || 1 : 1,
            limit: q.limit != null ? Number(q.limit) || 10 : 10,
            sort_by: q.sort_by,
        };
        const result = await searchService_Pratham_1.SearchService.searchEvents(params);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'Search results', 200, {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Search failed', 'SEARCH_ERROR', error.statusCode || 500);
    }
}
async function getTrending(_req, res) {
    try {
        const events = await searchService_Pratham_1.SearchService.getTrendingEvents();
        (0, responseHelper_Pratham_1.successResponse)(res, events, 'Trending events retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get trending events', 'TRENDING_ERROR', error.statusCode || 500);
    }
}
