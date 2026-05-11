"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(res, data, message = 'Success', statusCode = 200, pagination) {
    const body = {
        success: true,
        message,
        data,
    };
    if (pagination) {
        body.pagination = pagination;
    }
    return res.status(statusCode).json(body);
}
function errorResponse(res, message, code, statusCode = 500, details) {
    const body = {
        success: false,
        error: {
            code,
            message,
        },
    };
    if (details) {
        body.error.details = details;
    }
    return res.status(statusCode).json(body);
}
