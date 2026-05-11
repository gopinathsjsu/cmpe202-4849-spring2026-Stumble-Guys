"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.listEvents = listEvents;
exports.getEventBySlug = getEventBySlug;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.getMyEvents = getMyEvents;
exports.submitForApproval = submitForApproval;
exports.getAttendees = getAttendees;
exports.getOrganizerDashboard = getOrganizerDashboard;
exports.getOrganizerPendingRsvps = getOrganizerPendingRsvps;
exports.getEventGuestlist = getEventGuestlist;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const eventService_Nikhil_1 = require("../services/eventService_Nikhil");
/** Collect category UUIDs from repeated or comma-separated query params */
function parseCategoryIdsFromQuery(query) {
    const keys = ['category_ids', 'category_id', 'category'];
    const ids = [];
    for (const key of keys) {
        const v = query[key];
        if (v == null)
            continue;
        if (Array.isArray(v)) {
            for (const item of v) {
                const s = String(item).trim();
                if (s)
                    ids.push(s);
            }
        }
        else {
            const s = String(v).trim();
            if (s.includes(',')) {
                ids.push(...s.split(',').map((x) => x.trim()).filter(Boolean));
            }
            else if (s) {
                ids.push(s);
            }
        }
    }
    const unique = [...new Set(ids)];
    return unique.length ? unique : undefined;
}
function parseIsFreeFromQuery(query) {
    const v = query.is_free;
    if (v === undefined || v === '')
        return undefined;
    if (Array.isArray(v)) {
        const s = String(v[0]).toLowerCase();
        if (s === 'true')
            return true;
        if (s === 'false')
            return false;
        return undefined;
    }
    const s = String(v).toLowerCase();
    if (s === 'true')
        return true;
    if (s === 'false')
        return false;
    return undefined;
}
async function createEvent(req, res) {
    try {
        const { userId } = req.user;
        const event = await eventService_Nikhil_1.EventService.createEvent(userId, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, event, 'Event created', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to create event', 'CREATE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function listEvents(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categoryIds = parseCategoryIdsFromQuery(req.query);
        const filters = {
            ...(categoryIds?.length === 1
                ? { category_id: categoryIds[0], category_ids: undefined }
                : categoryIds && categoryIds.length > 1
                    ? { category_ids: categoryIds }
                    : {}),
            search: req.query.search,
            start_date: (req.query.start_date ?? req.query.startDate),
            end_date: (req.query.end_date ?? req.query.endDate),
            city: req.query.city,
            is_free: parseIsFreeFromQuery(req.query),
            status: req.query.status,
        };
        const result = await eventService_Nikhil_1.EventService.listEvents(filters, page, limit);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'Events retrieved', 200, {
            page,
            limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to list events', 'LIST_EVENTS_ERROR', error.statusCode || 500);
    }
}
async function getEventBySlug(req, res) {
    try {
        const { slug } = req.params;
        const requester = req.user;
        const event = await eventService_Nikhil_1.EventService.getEventBySlug(slug, requester ? { userId: requester.userId, role: requester.role } : undefined);
        (0, responseHelper_Pratham_1.successResponse)(res, event, 'Event retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Event not found', 'EVENT_NOT_FOUND', error.statusCode || 404);
    }
}
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        if (role === 'organizer') {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Organizers cannot edit events. Use event updates instead.', 'FORBIDDEN', 403);
            return;
        }
        const event = await eventService_Nikhil_1.EventService.updateEvent(id, userId, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, event, 'Event updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update event', 'UPDATE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        await eventService_Nikhil_1.EventService.deleteEvent(id, userId, role);
        (0, responseHelper_Pratham_1.successResponse)(res, null, 'Event deleted');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to delete event', 'DELETE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function getMyEvents(req, res) {
    try {
        const { userId } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || undefined;
        const result = await eventService_Nikhil_1.EventService.getEventsByOrganizer(userId, { status }, page, limit);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'Organizer events retrieved', 200, {
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get events', 'MY_EVENTS_ERROR', error.statusCode || 500);
    }
}
async function submitForApproval(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const result = await eventService_Nikhil_1.EventService.submitForApproval(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Event submitted for approval');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to submit event', 'SUBMIT_APPROVAL_ERROR', error.statusCode || 500);
    }
}
async function getAttendees(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const attendees = await eventService_Nikhil_1.EventService.getAttendees(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, attendees, 'Attendees retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get attendees', 'ATTENDEES_ERROR', error.statusCode || 500);
    }
}
async function getOrganizerDashboard(req, res) {
    try {
        const { userId } = req.user;
        const data = await eventService_Nikhil_1.EventService.getOrganizerDashboard(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, data, 'Organizer dashboard retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to load dashboard', 'ORG_DASHBOARD_ERROR', error.statusCode || 500);
    }
}
async function getOrganizerPendingRsvps(req, res) {
    try {
        const { userId } = req.user;
        const rows = await eventService_Nikhil_1.EventService.getOrganizerPendingRsvps(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, rows, 'Pending RSVPs retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to load pending RSVPs', 'ORG_PENDING_RSVPS_ERROR', error.statusCode || 500);
    }
}
async function getEventGuestlist(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const search = req.query.search || undefined;
        const data = await eventService_Nikhil_1.EventService.getEventGuestlist(id, userId, search);
        (0, responseHelper_Pratham_1.successResponse)(res, data, 'Guestlist retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to load guestlist', 'GUESTLIST_ERROR', error.statusCode || 500);
    }
}
