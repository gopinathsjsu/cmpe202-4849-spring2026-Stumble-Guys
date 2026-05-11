"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(255),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    short_desc: zod_1.z.string().optional(),
    start_date: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]),
    end_date: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]),
    timezone: zod_1.z.string().min(1).max(100).optional(),
    venue_name: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    zip_code: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    google_maps_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    is_online: zod_1.z.boolean().optional(),
    online_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    image_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    capacity: zod_1.z.number().int().min(10).max(1000),
    is_free: zod_1.z.boolean().optional(),
    price: zod_1.z.number().min(0).optional(),
    category_id: zod_1.z.string().uuid().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    schedule: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        start_time: zod_1.z.string(),
        end_time: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    })).optional(),
});
exports.updateEventSchema = exports.createEventSchema.partial();
exports.approvalSchema = zod_1.z.object({
    notes: zod_1.z.string().optional(),
});
