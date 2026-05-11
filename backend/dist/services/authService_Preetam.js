"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
const jwt_Preetam_1 = require("../config/jwt_Preetam");
const passwordUtils_Preetam_1 = require("../utils/passwordUtils_Preetam");
class AuthService {
    static async register(input) {
        const existing = await database_Preetam_1.default.user.findUnique({
            where: { email: input.email },
        });
        if (existing) {
            throw new Error('Email already registered');
        }
        const password_hash = await (0, passwordUtils_Preetam_1.hashPassword)(input.password);
        const user = await database_Preetam_1.default.user.create({
            data: {
                email: input.email,
                password_hash,
                first_name: input.first_name,
                last_name: input.last_name,
                role: input.role ?? 'attendee',
            },
        });
        const tokens = await this.generateTokens(user);
        return {
            user: this.formatUser(user),
            ...tokens,
        };
    }
    static async login(input) {
        const user = await database_Preetam_1.default.user.findUnique({
            where: { email: input.email },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const valid = await (0, passwordUtils_Preetam_1.comparePassword)(input.password, user.password_hash);
        if (!valid) {
            throw new Error('Invalid email or password');
        }
        if (!user.is_active) {
            throw new Error('Account is deactivated');
        }
        const tokens = await this.generateTokens(user);
        return {
            user: this.formatUser(user),
            ...tokens,
        };
    }
    static async refreshToken(token) {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, jwt_Preetam_1.jwtConfig.refreshSecret);
        }
        catch {
            throw new Error('Invalid refresh token');
        }
        const stored = await database_Preetam_1.default.refreshToken.findFirst({
            where: { token, user_id: payload.userId },
        });
        if (!stored || stored.expires_at < new Date()) {
            throw new Error('Refresh token expired or revoked');
        }
        const user = await database_Preetam_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, jwt_Preetam_1.jwtConfig.secret, { expiresIn: jwt_Preetam_1.jwtConfig.expiresIn });
        return { accessToken };
    }
    static async logout(userId, refreshToken) {
        await database_Preetam_1.default.refreshToken.deleteMany({
            where: { user_id: userId, token: refreshToken },
        });
    }
    static async generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, jwt_Preetam_1.jwtConfig.secret, {
            expiresIn: jwt_Preetam_1.jwtConfig.expiresIn,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, jwt_Preetam_1.jwtConfig.refreshSecret, {
            expiresIn: jwt_Preetam_1.jwtConfig.refreshExpiresIn,
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await database_Preetam_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: user.id,
                expires_at: expiresAt,
            },
        });
        return { accessToken, refreshToken };
    }
    static async getProfile(userId) {
        const user = await database_Preetam_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return this.formatUser(user);
    }
    static async updateProfile(userId, input) {
        const user = await database_Preetam_1.default.user.update({
            where: { id: userId },
            data: {
                ...(input.first_name !== undefined && { first_name: input.first_name }),
                ...(input.last_name !== undefined && { last_name: input.last_name }),
                ...(input.phone !== undefined && { phone: input.phone }),
                ...(input.bio !== undefined && { bio: input.bio }),
            },
        });
        return this.formatUser(user);
    }
    static async changePassword(userId, input) {
        const user = await database_Preetam_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const valid = await (0, passwordUtils_Preetam_1.comparePassword)(input.current_password, user.password_hash);
        if (!valid) {
            throw new Error('Current password is incorrect');
        }
        const newHash = await (0, passwordUtils_Preetam_1.hashPassword)(input.new_password);
        await database_Preetam_1.default.user.update({
            where: { id: userId },
            data: { password_hash: newHash },
        });
    }
    static async updateAvatar(userId, avatarUrl) {
        const user = await database_Preetam_1.default.user.update({
            where: { id: userId },
            data: { avatar_url: avatarUrl },
        });
        return this.formatUser(user);
    }
    static formatUser(user) {
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            avatar_url: user.avatar_url,
            phone: user.phone,
            bio: user.bio,
            is_verified: user.is_verified,
            created_at: user.created_at,
            google_calendar_connected: Boolean(user.google_calendar_refresh_token),
        };
    }
}
exports.AuthService = AuthService;
