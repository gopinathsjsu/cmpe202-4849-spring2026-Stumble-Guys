"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    first_name: zod_1.z.string().min(1, 'First name is required').max(100),
    last_name: zod_1.z.string().min(1, 'Last name is required').max(100),
    role: zod_1.z.enum(['attendee', 'organizer']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.updateProfileSchema = zod_1.z.object({
    first_name: zod_1.z.string().min(1).max(100).optional(),
    last_name: zod_1.z.string().min(1).max(100).optional(),
    phone: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    current_password: zod_1.z.string().min(1, 'Current password is required'),
    new_password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
