import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/responseHelper_Pratham';

const isDev = process.env.NODE_ENV === 'development';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[errorHandler]', err);

  if (err instanceof PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
    return;
  }

  if (err instanceof ZodError) {
    errorResponse(res, 'Validation failed', 'VALIDATION_ERROR', 400, {
      issues: err.issues,
      flatten: err.flatten(),
    });
    return;
  }

  if (err instanceof TokenExpiredError) {
    errorResponse(res, 'Token expired', 'TOKEN_EXPIRED', 401);
    return;
  }

  if (err instanceof JsonWebTokenError) {
    errorResponse(res, 'Invalid token', 'INVALID_TOKEN', 401);
    return;
  }

  if (err instanceof Error) {
    const status = (err as Error & { status?: number }).status ?? 500;
    const code = status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
    const body: Record<string, unknown> = {
      message: err.message || 'An error occurred',
    };

    if (isDev && err.stack) {
      body.stack = err.stack;
    }

    errorResponse(res, err.message || 'An error occurred', code, status, isDev ? body : undefined);
    return;
  }

  errorResponse(res, 'Internal server error', 'INTERNAL_ERROR', 500, isDev ? { detail: String(err) } : undefined);
}

function handlePrismaError(err: PrismaClientKnownRequestError, res: Response): void {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      errorResponse(res, `Unique constraint failed on ${target}`, 'CONFLICT', 409, {
        code: err.code,
        meta: err.meta,
      });
      return;
    }
    case 'P2025':
      errorResponse(res, 'Record not found', 'NOT_FOUND', 404, {
        code: err.code,
        meta: err.meta,
      });
      return;
    case 'P2003':
      errorResponse(res, 'Foreign key constraint failed', 'BAD_REQUEST', 400, {
        code: err.code,
        meta: err.meta,
      });
      return;
    case 'P2014':
      errorResponse(res, 'Invalid relation', 'BAD_REQUEST', 400, {
        code: err.code,
        meta: err.meta,
      });
      return;
    default:
      errorResponse(res, 'Database error', 'DATABASE_ERROR', 500, isDev ? { code: err.code, meta: err.meta } : undefined);
  }
}
