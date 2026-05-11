"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpSchema = exports.purchaseTicketSchema = exports.createTicketTypeSchema = void 0;
const zod_1 = require("zod");
exports.createTicketTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    price: zod_1.z.number().min(0).optional(),
    quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1'),
    description: zod_1.z.string().optional(),
});
exports.purchaseTicketSchema = zod_1.z.object({
    ticket_type_id: zod_1.z.string().uuid('Invalid ticket type ID'),
    quantity: zod_1.z.number().int().min(1).max(10, 'Maximum 10 tickets per purchase'),
});
exports.rsvpSchema = zod_1.z.object({
    status: zod_1.z.enum(['going', 'maybe', 'not_going']),
});
