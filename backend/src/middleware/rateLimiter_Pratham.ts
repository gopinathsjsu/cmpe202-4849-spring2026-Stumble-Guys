import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/responseHelper_Pratham';

const windowMs = 15 * 60 * 1000;

export const apiLimiter = rateLimit({
  windowMs,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    errorResponse(
      res,
      'Too many requests from this IP, please try again later.',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  },
});

export const authLimiter = rateLimit({
  windowMs,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    errorResponse(
      res,
      'Too many authentication attempts, please try again later.',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  },
});
