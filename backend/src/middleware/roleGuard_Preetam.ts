import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/responseHelper_Pratham';

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(res, 'Insufficient permissions', 'FORBIDDEN', 403);
      return;
    }

    next();
  };
}
