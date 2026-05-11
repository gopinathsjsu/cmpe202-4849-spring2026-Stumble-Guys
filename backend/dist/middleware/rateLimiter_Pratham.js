"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const windowMs = 15 * 60 * 1000;
/** Rate limiting is for production only. Local/dev often sets NODE_ENV=production by mistake or hot-reloads many requests. */
function rateLimitingEnabled() {
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
        return false;
    }
    return process.env.NODE_ENV === 'production';
}
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs,
    max: Number(process.env.API_RATE_LIMIT_MAX ?? 300),
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => !rateLimitingEnabled(),
    handler: (_req, res) => {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Too many requests from this IP, please try again later.', 'RATE_LIMIT_EXCEEDED', 429);
    },
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 50),
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => !rateLimitingEnabled(),
    handler: (_req, res) => {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Too many authentication attempts, please try again later.', 'RATE_LIMIT_EXCEEDED', 429);
    },
});
