"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUpdates = listUpdates;
exports.createUpdate = createUpdate;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const eventUpdateService_Preetam_1 = require("../services/eventUpdateService_Preetam");
async function listUpdates(req, res) {
    try {
        const { id: eventId } = req.params;
        const rows = await eventUpdateService_Preetam_1.EventUpdateService.list(eventId);
        (0, responseHelper_Pratham_1.successResponse)(res, rows, 'Event updates retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to list updates', 'LIST_UPDATES_ERROR', error.statusCode || 500);
    }
}
async function createUpdate(req, res) {
    try {
        const { id: eventId } = req.params;
        const { userId, role } = req.user;
        const { message } = req.body;
        const created = await eventUpdateService_Preetam_1.EventUpdateService.create({
            eventId,
            authorId: userId,
            authorRole: role,
            message: message ?? '',
        });
        (0, responseHelper_Pratham_1.successResponse)(res, created, 'Event update created', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to create update', 'CREATE_UPDATE_ERROR', error.statusCode || 500);
    }
}
