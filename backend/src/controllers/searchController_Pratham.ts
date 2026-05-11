import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { SearchService } from '../services/searchService_Pratham';
import type { SearchQuery } from '../types/search_Pratham';

function parseCategoryFromQuery(q: Record<string, unknown>): string | undefined {
  const keys = ['category_ids', 'category_id', 'category', 'categories'] as const;
  const ids: string[] = [];
  for (const key of keys) {
    const v = q[key];
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const item of v) {
        const s = String(item).trim();
        if (!s) continue;
        ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
      }
    } else {
      const s = String(v).trim();
      if (!s) continue;
      ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
    }
  }
  const unique = [...new Set(ids)];
  return unique.length ? unique.join(',') : undefined;
}

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const q = req.query as Record<string, unknown>;
    const isFreeRaw = q.is_free;
    let isFreeParsed: boolean | undefined;
    if (isFreeRaw !== undefined && isFreeRaw !== '') {
      const s = Array.isArray(isFreeRaw)
        ? String(isFreeRaw[0]).toLowerCase()
        : String(isFreeRaw).toLowerCase();
      if (s === 'true') isFreeParsed = true;
      else if (s === 'false') isFreeParsed = false;
    }
    const params: SearchQuery = {
      q: q.q as string | undefined,
      category: parseCategoryFromQuery(q),
      city: q.city as string | undefined,
      start_date: q.start_date as string | undefined,
      end_date: q.end_date as string | undefined,
      is_free: isFreeParsed,
      page: q.page != null ? Number(q.page) || 1 : 1,
      limit: q.limit != null ? Number(q.limit) || 10 : 10,
      sort_by: q.sort_by as string | undefined,
    };

    const result = await SearchService.searchEvents(params);
    successResponse(res, result.data, 'Search results', 200, {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    });
  } catch (error: any) {
    errorResponse(res, error.message || 'Search failed', 'SEARCH_ERROR', error.statusCode || 500);
  }
}

export async function getTrending(_req: Request, res: Response): Promise<void> {
  try {
    const events = await SearchService.getTrendingEvents();
    successResponse(res, events, 'Trending events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get trending events', 'TRENDING_ERROR', error.statusCode || 500);
  }
}
