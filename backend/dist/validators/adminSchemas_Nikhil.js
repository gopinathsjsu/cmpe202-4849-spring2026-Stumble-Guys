"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryBodySchema = exports.rejectEventBodySchema = void 0;
const zod_1 = require("zod");
exports.rejectEventBodySchema = zod_1.z.object({
    notes: zod_1.z.string().trim().min(1, 'Reason for rejection is required'),
});
exports.categoryBodySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
    icon: zod_1.z.string().trim().max(64).optional().nullable(),
});
