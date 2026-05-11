"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const library_1 = require("@prisma/client/runtime/library");
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const isDev = process.env.NODE_ENV === 'development';
function errorHandler(err, _req, res, _next) {
    console.error('[errorHandler]', err);
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        handlePrismaError(err, res);
        return;
    }
    if (err instanceof zod_1.ZodError) {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Validation failed', 'VALIDATION_ERROR', 400, {
            issues: err.issues,
            flatten: err.flatten(),
        });
        return;
    }
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Token expired', 'TOKEN_EXPIRED', 401);
        return;
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Invalid token', 'INVALID_TOKEN', 401);
        return;
    }
    if (err instanceof Error) {
        const status = err.status ?? 500;
        const code = status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
        const body = {
            message: err.message || 'An error occurred',
        };
        if (isDev && err.stack) {
            body.stack = err.stack;
        }
        (0, responseHelper_Pratham_1.errorResponse)(res, err.message || 'An error occurred', code, status, isDev ? body : undefined);
        return;
    }
    (0, responseHelper_Pratham_1.errorResponse)(res, 'Internal server error', 'INTERNAL_ERROR', 500, isDev ? { detail: String(err) } : undefined);
}
function handlePrismaError(err, res) {
    switch (err.code) {
        case 'P2002': {
            const target = err.meta?.target?.join(', ') ?? 'field';
            (0, responseHelper_Pratham_1.errorResponse)(res, `Unique constraint failed on ${target}`, 'CONFLICT', 409, {
                code: err.code,
                meta: err.meta,
            });
            return;
        }
        case 'P2025':
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Record not found', 'NOT_FOUND', 404, {
                code: err.code,
                meta: err.meta,
            });
            return;
        case 'P2003':
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Foreign key constraint failed', 'BAD_REQUEST', 400, {
                code: err.code,
                meta: err.meta,
            });
            return;
        case 'P2014':
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Invalid relation', 'BAD_REQUEST', 400, {
                code: err.code,
                meta: err.meta,
            });
            return;
        default:
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Database error', 'DATABASE_ERROR', 500, isDev ? { code: err.code, meta: err.meta } : undefined);
    }
}
