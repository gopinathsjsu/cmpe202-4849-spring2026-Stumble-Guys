import jwt from 'jsonwebtoken';
import prisma from '../config/database_Preetam';
import { jwtConfig } from '../config/jwt_Preetam';
import { hashPassword, comparePassword } from '../utils/passwordUtils_Preetam';
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserResponse,
  JwtPayload,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../types/auth_Preetam';

export class AuthService {
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('Email already registered');
    }

    const password_hash = await hashPassword(input.password);

    const user = await prisma.user.create({
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

  static async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await comparePassword(input.password, user.password_hash);
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

  static async refreshToken(token: string): Promise<{ accessToken: string }> {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
    } catch {
      throw new Error('Invalid refresh token');
    }

    const stored = await prisma.refreshToken.findFirst({
      where: { token, user_id: payload.userId },
    });

    if (!stored || stored.expires_at < new Date()) {
      throw new Error('Refresh token expired or revoked');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as JwtPayload,
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { accessToken };
  }

  static async logout(userId: string, refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { user_id: userId, token: refreshToken },
    });
  }

  static async generateTokens(
    user: { id: string; email: string; role: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  static async getProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUser(user);
  }

  static async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserResponse> {
    const user = await prisma.user.update({
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

  static async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const valid = await comparePassword(input.current_password, user.password_hash);
    if (!valid) {
      throw new Error('Current password is incorrect');
    }

    const newHash = await hashPassword(input.new_password);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newHash },
    });
  }

  static async updateAvatar(
    userId: string,
    avatarUrl: string
  ): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar_url: avatarUrl },
    });

    return this.formatUser(user);
  }

  private static formatUser(user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    avatar_url: string | null;
    phone: string | null;
    bio: string | null;
    is_verified: boolean;
    created_at: Date;
    google_calendar_refresh_token?: string | null;
  }): UserResponse {
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
