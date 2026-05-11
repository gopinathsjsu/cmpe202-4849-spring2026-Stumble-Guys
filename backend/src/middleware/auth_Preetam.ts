import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt_Preetam';
import { errorResponse } from '../utils/responseHelper_Pratham';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  if (!token) {
    errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as jwt.JwtPayload & Partial<AuthTokenPayload>;

    const userId = decoded.userId ?? (decoded.sub as string | undefined);
    const email = decoded.email;
    const role = decoded.role;

    if (!userId || !email || !role) {
      errorResponse(res, 'Invalid token payload', 'UNAUTHORIZED', 401);
      return;
    }

    req.user = {
      userId,
      email,
      role,
    };

    next();
  } catch {
    errorResponse(res, 'Invalid or expired token', 'UNAUTHORIZED', 401);
  }
}
