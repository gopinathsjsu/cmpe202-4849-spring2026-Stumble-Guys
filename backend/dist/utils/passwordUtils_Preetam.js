"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.validatePasswordStrength = validatePasswordStrength;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(SALT_ROUNDS);
    return bcryptjs_1.default.hash(password, salt);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function validatePasswordStrength(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least 1 uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least 1 number');
    }
    return { valid: errors.length === 0, errors };
}
