import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt_Preetam';
import type { AuthTokenPayload } from './auth_Preetam';

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as jwt.JwtPayload &
      Partial<AuthTokenPayload>;

    const userId = decoded.userId ?? (decoded.sub as string | undefined);
    const email = decoded.email;
    const role = decoded.role;

    if (userId && email && role) {
      req.user = { userId, email, role };
    }
  } catch {
    // ignore invalid token for public routes
  }

  next();
}

