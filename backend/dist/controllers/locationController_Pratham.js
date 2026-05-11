"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearby = getNearby;
exports.getMapEvents = getMapEvents;
exports.saveEvent = saveEvent;
exports.unsaveEvent = unsaveEvent;
exports.getSavedEvents = getSavedEvents;
exports.getEventStats = getEventStats;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const locationService_Pratham_1 = require("../services/locationService_Pratham");
async function getNearby(req, res) {
    try {
        const q = req.query;
        const latitude = Number(q.latitude);
        const longitude = Number(q.longitude);
        const radius = q.radius != null ? Number(q.radius) : 25;
        const page = q.page != null ? Number(q.page) : 1;
        const limit = q.limit != null ? Number(q.limit) : 10;
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Valid latitude and longitude are required', 'VALIDATION_ERROR', 400);
            return;
        }
        const query = {
            latitude,
            longitude,
            radius,
            page,
            limit,
        };
        const events = await locationService_Pratham_1.LocationService.getNearbyEvents(query);
        (0, responseHelper_Pratham_1.successResponse)(res, events, 'Nearby events retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get nearby events', 'NEARBY_ERROR', error.statusCode || 500);
    }
}
async function getMapEvents(req, res) {
    try {
        const bounds = {
            north: parseFloat(req.query.north),
            south: parseFloat(req.query.south),
            east: parseFloat(req.query.east),
            west: parseFloat(req.query.west),
        };
        if (Object.values(bounds).some(isNaN)) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Valid bounds (north, south, east, west) are required', 'VALIDATION_ERROR', 400);
            return;
        }
        const events = await locationService_Pratham_1.LocationService.getEventsInBounds(bounds);
        (0, responseHelper_Pratham_1.successResponse)(res, events, 'Map events retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get map events', 'MAP_EVENTS_ERROR', error.statusCode || 500);
    }
}
async function saveEvent(req, res) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const result = await locationService_Pratham_1.LocationService.saveEvent(userId, id);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Event saved', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to save event', 'SAVE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function unsaveEvent(req, res) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        await locationService_Pratham_1.LocationService.unsaveEvent(userId, id);
        (0, responseHelper_Pratham_1.successResponse)(res, null, 'Event unsaved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to unsave event', 'UNSAVE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function getSavedEvents(req, res) {
    try {
        const { userId } = req.user;
        const events = await locationService_Pratham_1.LocationService.getSavedEvents(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, events, 'Saved events retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get saved events', 'SAVED_EVENTS_ERROR', error.statusCode || 500);
    }
}
async function getEventStats(req, res) {
    try {
        const { id } = req.params;
        const stats = await locationService_Pratham_1.LocationService.getEventStats(id);
        (0, responseHelper_Pratham_1.successResponse)(res, stats, 'Event stats retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get event stats', 'EVENT_STATS_ERROR', error.statusCode || 500);
    }
}
