"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRsvps = getMyRsvps;
exports.getMyRsvpForEvent = getMyRsvpForEvent;
exports.createRsvp = createRsvp;
exports.updateRsvp = updateRsvp;
exports.removeRsvp = removeRsvp;
exports.getEventRsvps = getEventRsvps;
exports.approveRsvp = approveRsvp;
exports.rejectRsvp = rejectRsvp;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const rsvpService_Sasi_1 = require("../services/rsvpService_Sasi");
async function getMyRsvps(req, res) {
    try {
        const { userId } = req.user;
        const rsvps = await rsvpService_Sasi_1.RsvpService.getRsvpsForUser(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvps, 'Your RSVPs retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get RSVPs', 'GET_MY_RSVPS_ERROR', error.statusCode || 500);
    }
}
async function getMyRsvpForEvent(req, res) {
    try {
        const { id: eventId } = req.params;
        const { userId } = req.user;
        const rsvp = await rsvpService_Sasi_1.RsvpService.getUserRsvp(eventId, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvp, 'RSVP status retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get RSVP', 'GET_RSVP_ME_ERROR', error.statusCode || 500);
    }
}
async function createRsvp(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { status } = req.body;
        const rsvp = await rsvpService_Sasi_1.RsvpService.createOrUpdateRsvp(id, userId, status);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvp, 'RSVP created', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to create RSVP', 'CREATE_RSVP_ERROR', error.statusCode || 500);
    }
}
async function updateRsvp(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { status } = req.body;
        const rsvp = await rsvpService_Sasi_1.RsvpService.createOrUpdateRsvp(id, userId, status);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvp, 'RSVP updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update RSVP', 'UPDATE_RSVP_ERROR', error.statusCode || 500);
    }
}
async function removeRsvp(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        await rsvpService_Sasi_1.RsvpService.removeRsvp(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, null, 'RSVP removed');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to remove RSVP', 'REMOVE_RSVP_ERROR', error.statusCode || 500);
    }
}
async function getEventRsvps(req, res) {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const result = await rsvpService_Sasi_1.RsvpService.getEventRsvps(id, userId, role, page, limit);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'RSVPs retrieved', 200, {
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get RSVPs', 'GET_RSVPS_ERROR', error.statusCode || 500);
    }
}
async function approveRsvp(req, res) {
    try {
        const { id: eventId, rsvpId } = req.params;
        const { userId, role } = req.user;
        const rsvp = await rsvpService_Sasi_1.RsvpService.approveRsvp(eventId, rsvpId, userId, role);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvp, 'RSVP approved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to approve RSVP', 'APPROVE_RSVP_ERROR', error.statusCode || 500);
    }
}
async function rejectRsvp(req, res) {
    try {
        const { id: eventId, rsvpId } = req.params;
        const { userId, role } = req.user;
        const rsvp = await rsvpService_Sasi_1.RsvpService.rejectRsvp(eventId, rsvpId, userId, role);
        (0, responseHelper_Pratham_1.successResponse)(res, rsvp, 'RSVP rejected');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to reject RSVP', 'REJECT_RSVP_ERROR', error.statusCode || 500);
    }
}
