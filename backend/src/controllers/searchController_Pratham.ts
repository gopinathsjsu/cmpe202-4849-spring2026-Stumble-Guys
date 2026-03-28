import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { SearchService } from '../services/searchService_Pratham';
import type { SearchQuery } from '../types/search_Pratham';

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const q = req.query as Record<string, unknown>;
    const params: SearchQuery = {
      q: q.q as string | undefined,
      category: q.category as string | undefined,
      city: q.city as string | undefined,
      start_date: q.start_date as string | undefined,
      end_date: q.end_date as string | undefined,
      is_free: typeof q.is_free === 'boolean' ? q.is_free : undefined,
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

// View tracking and trending endpoint - Sprint 4
