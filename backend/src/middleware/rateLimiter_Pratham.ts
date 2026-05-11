import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/responseHelper_Pratham';

const windowMs = 15 * 60 * 1000;

/** Rate limiting is for production only. Local/dev often sets NODE_ENV=production by mistake or hot-reloads many requests. */
function rateLimitingEnabled(): boolean {
  if (process.env.DISABLE_RATE_LIMIT === 'true') {
    return false;
  }
  return process.env.NODE_ENV === 'production';
}

export const apiLimiter = rateLimit({
  windowMs,
  max: Number(process.env.API_RATE_LIMIT_MAX ?? 300),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !rateLimitingEnabled(),
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
  max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 50),
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !rateLimitingEnabled(),
  handler: (_req, res) => {
    errorResponse(
      res,
      'Too many authentication attempts, please try again later.',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  },
});
