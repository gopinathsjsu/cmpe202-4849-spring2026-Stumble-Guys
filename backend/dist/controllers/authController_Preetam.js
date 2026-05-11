"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.uploadAvatar = uploadAvatar;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const authService_Preetam_1 = require("../services/authService_Preetam");
async function register(req, res) {
    try {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Missing required fields', 'VALIDATION_ERROR', 400);
            return;
        }
        const result = await authService_Preetam_1.AuthService.register(req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Registration successful', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Registration failed', 'REGISTER_ERROR', error.statusCode || 500);
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await authService_Preetam_1.AuthService.login({ email, password });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        (0, responseHelper_Pratham_1.successResponse)(res, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
        }, 'Login successful');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Login failed', 'LOGIN_ERROR', error.statusCode || 401);
    }
}
async function refreshToken(req, res) {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        if (!token) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Refresh token is required', 'TOKEN_MISSING', 400);
            return;
        }
        const result = await authService_Preetam_1.AuthService.refreshToken(token);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Token refreshed');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Token refresh failed', 'REFRESH_ERROR', error.statusCode || 401);
    }
}
async function logout(req, res) {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        const { userId } = req.user;
        await authService_Preetam_1.AuthService.logout(userId, token);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        (0, responseHelper_Pratham_1.successResponse)(res, null, 'Logged out successfully');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Logout failed', 'LOGOUT_ERROR', error.statusCode || 500);
    }
}
async function getProfile(req, res) {
    try {
        const { userId } = req.user;
        const profile = await authService_Preetam_1.AuthService.getProfile(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, profile, 'Profile retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get profile', 'PROFILE_ERROR', error.statusCode || 500);
    }
}
async function updateProfile(req, res) {
    try {
        const { userId } = req.user;
        const updated = await authService_Preetam_1.AuthService.updateProfile(userId, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, updated, 'Profile updated');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to update profile', 'PROFILE_UPDATE_ERROR', error.statusCode || 500);
    }
}
async function changePassword(req, res) {
    try {
        const { userId } = req.user;
        await authService_Preetam_1.AuthService.changePassword(userId, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, null, 'Password changed successfully');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to change password', 'PASSWORD_ERROR', error.statusCode || 500);
    }
}
async function uploadAvatar(req, res) {
    try {
        const { userId } = req.user;
        const file = req.file;
        if (!file) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'No file uploaded', 'FILE_MISSING', 400);
            return;
        }
        const result = await authService_Preetam_1.AuthService.updateAvatar(userId, file.path);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Avatar uploaded successfully');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to upload avatar', 'AVATAR_ERROR', error.statusCode || 500);
    }
}
