import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { AuthService } from '../services/authService_Preetam';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
      errorResponse(res, 'Missing required fields', 'VALIDATION_ERROR', 400);
      return;
    }

    const result = await AuthService.register(req.body);
    successResponse(res, result, 'Registration successful', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Registration failed', 'REGISTER_ERROR', error.statusCode || 500);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    }, 'Login successful');
  } catch (error: any) {
    errorResponse(res, error.message || 'Login failed', 'LOGIN_ERROR', error.statusCode || 401);
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      errorResponse(res, 'Refresh token is required', 'TOKEN_MISSING', 400);
      return;
    }

    const result = await AuthService.refreshToken(token);
    successResponse(res, result, 'Token refreshed');
  } catch (error: any) {
    errorResponse(res, error.message || 'Token refresh failed', 'REFRESH_ERROR', error.statusCode || 401);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    const { userId } = (req as any).user;
    await AuthService.logout(userId, token);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    successResponse(res, null, 'Logged out successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Logout failed', 'LOGOUT_ERROR', error.statusCode || 500);
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const profile = await AuthService.getProfile(userId);
    successResponse(res, profile, 'Profile retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to get profile', 'PROFILE_ERROR', error.statusCode || 500);
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const updated = await AuthService.updateProfile(userId, req.body);
    successResponse(res, updated, 'Profile updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update profile', 'PROFILE_UPDATE_ERROR', error.statusCode || 500);
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    await AuthService.changePassword(userId, req.body);
    successResponse(res, null, 'Password changed successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to change password', 'PASSWORD_ERROR', error.statusCode || 500);
  }
}

export async function uploadAvatar(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const file = (req as any).file;

    if (!file) {
      errorResponse(res, 'No file uploaded', 'FILE_MISSING', 400);
      return;
    }

    const result = await AuthService.updateAvatar(userId, file.path);
    successResponse(res, result, 'Avatar uploaded successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to upload avatar', 'AVATAR_ERROR', error.statusCode || 500);
  }
}
