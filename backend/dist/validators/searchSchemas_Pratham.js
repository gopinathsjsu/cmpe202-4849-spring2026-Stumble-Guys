"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBoundsSchema = exports.nearbyQuerySchema = exports.searchQuerySchema = void 0;
const zod_1 = require("zod");
exports.searchQuerySchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
    is_free: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().default(1),
    limit: zod_1.z.coerce.number().int().default(20),
    sort_by: zod_1.z.string().optional(),
});
exports.nearbyQuerySchema = zod_1.z.object({
    latitude: zod_1.z.coerce.number(),
    longitude: zod_1.z.coerce.number(),
    radius: zod_1.z.coerce.number().default(25),
    page: zod_1.z.coerce.number().int().optional(),
    limit: zod_1.z.coerce.number().int().optional(),
});
exports.mapBoundsSchema = zod_1.z.object({
    north: zod_1.z.coerce.number(),
    south: zod_1.z.coerce.number(),
    east: zod_1.z.coerce.number(),
    west: zod_1.z.coerce.number(),
});
