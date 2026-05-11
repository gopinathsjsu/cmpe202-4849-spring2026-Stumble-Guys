"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.updateUserRole = updateUserRole;
exports.updateUserStatus = updateUserStatus;
exports.deleteUser = deleteUser;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const userService_Preetam_1 = require("../services/userService_Preetam");
async function listUsers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || undefined;
        const role = req.query.role || undefined;
        const result = await userService_Preetam_1.UserService.listUsers(page, limit, search, role);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'Users retrieved', 200, {
            page,
            limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to list users', 'LIST_USERS_ERROR', error.statusCode || 500);
    }
}
async function updateUserRole(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const result = await userService_Preetam_1.UserService.updateUserRole(id, role);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'User role updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update user role', 'ROLE_UPDATE_ERROR', error.statusCode || 500);
    }
}
async function updateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const result = await userService_Preetam_1.UserService.updateUserStatus(id, is_active);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'User status updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update user status', 'STATUS_UPDATE_ERROR', error.statusCode || 500);
    }
}
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const result = await userService_Preetam_1.UserService.deleteUser(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'User deleted');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to delete user', 'DELETE_USER_ERROR', error.statusCode || 500);
    }
}
