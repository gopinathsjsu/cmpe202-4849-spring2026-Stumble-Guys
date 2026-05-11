import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { LocationService } from '../services/locationService_Pratham';
import type { NearbyQuery } from '../types/search_Pratham';

export async function getNearby(req: Request, res: Response): Promise<void> {
  try {
    const q = req.query as Record<string, unknown>;
    const latitude = Number(q.latitude);
    const longitude = Number(q.longitude);
    const radius = q.radius != null ? Number(q.radius) : 25;
    const page = q.page != null ? Number(q.page) : 1;
    const limit = q.limit != null ? Number(q.limit) : 10;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      errorResponse(res, 'Valid latitude and longitude are required', 'VALIDATION_ERROR', 400);
      return;
    }

    const query: NearbyQuery = {
      latitude,
      longitude,
      radius,
      page,
      limit,
    };

    const events = await LocationService.getNearbyEvents(query);
    successResponse(res, events, 'Nearby events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get nearby events', 'NEARBY_ERROR', error.statusCode || 500);
  }
}

export async function getMapEvents(req: Request, res: Response): Promise<void> {
  try {
    const bounds = {
      north: parseFloat(req.query.north as string),
      south: parseFloat(req.query.south as string),
      east: parseFloat(req.query.east as string),
      west: parseFloat(req.query.west as string),
    };

    if (Object.values(bounds).some(isNaN)) {
      errorResponse(res, 'Valid bounds (north, south, east, west) are required', 'VALIDATION_ERROR', 400);
      return;
    }

    const events = await LocationService.getEventsInBounds(bounds);
    successResponse(res, events, 'Map events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get map events', 'MAP_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function saveEvent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const { id } = req.params;
    const result = await LocationService.saveEvent(userId, id);
    successResponse(res, result, 'Event saved', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to save event', 'SAVE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function unsaveEvent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const { id } = req.params;
    await LocationService.unsaveEvent(userId, id);
    successResponse(res, null, 'Event unsaved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to unsave event', 'UNSAVE_EVENT_ERROR', error.statusCode || 500);
  }
}

export async function getSavedEvents(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const events = await LocationService.getSavedEvents(userId);
    successResponse(res, events, 'Saved events retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get saved events', 'SAVED_EVENTS_ERROR', error.statusCode || 500);
  }
}

export async function getEventStats(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const stats = await LocationService.getEventStats(id);
    successResponse(res, stats, 'Event stats retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get event stats', 'EVENT_STATS_ERROR', error.statusCode || 500);
  }
}
