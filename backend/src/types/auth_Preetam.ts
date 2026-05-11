export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: 'attendee' | 'organizer';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
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
  /** True when the user has completed Google Calendar OAuth (refresh token stored). */
  google_calendar_connected?: boolean;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}
