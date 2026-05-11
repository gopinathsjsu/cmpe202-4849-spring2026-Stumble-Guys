"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingEvents = getPendingEvents;
exports.approveEvent = approveEvent;
exports.rejectEvent = rejectEvent;
exports.getDashboardStats = getDashboardStats;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const adminService_Nikhil_1 = require("../services/adminService_Nikhil");
const categoryAdminService_Nikhil_1 = require("../services/categoryAdminService_Nikhil");
async function getPendingEvents(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const status = req.query.status || 'pending_approval';
        const result = await adminService_Nikhil_1.AdminService.getModerationQueue(page, limit, status);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Events retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get pending events', 'PENDING_EVENTS_ERROR', error.statusCode || 500);
    }
}
async function approveEvent(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { notes } = req.body;
        const result = await adminService_Nikhil_1.AdminService.approveEvent(id, userId, notes);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Event approved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to approve event', 'APPROVE_EVENT_ERROR', error.statusCode || 500);
    }
}
async function rejectEvent(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { notes } = req.body;
        const result = await adminService_Nikhil_1.AdminService.rejectEvent(id, userId, notes);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Event rejected');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to reject event', 'REJECT_EVENT_ERROR', error.statusCode || 500);
    }
}
async function getDashboardStats(_req, res) {
    try {
        const stats = await adminService_Nikhil_1.AdminService.getDashboardStats();
        (0, responseHelper_Pratham_1.successResponse)(res, stats, 'Dashboard stats retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get dashboard stats', 'DASHBOARD_STATS_ERROR', error.statusCode || 500);
    }
}
async function createCategory(req, res) {
    try {
        const { name, icon } = req.body;
        const row = await categoryAdminService_Nikhil_1.CategoryAdminService.create(name, icon);
        (0, responseHelper_Pratham_1.successResponse)(res, row, 'Category created', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to create category', 'CREATE_CATEGORY_ERROR', error.statusCode || 500);
    }
}
async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        const row = await categoryAdminService_Nikhil_1.CategoryAdminService.update(id, name, icon);
        (0, responseHelper_Pratham_1.successResponse)(res, row, 'Category updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update category', 'UPDATE_CATEGORY_ERROR', error.statusCode || 500);
    }
}
async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        const result = await categoryAdminService_Nikhil_1.CategoryAdminService.remove(id);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Category deleted');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to delete category', 'DELETE_CATEGORY_ERROR', error.statusCode || 500);
    }
}
