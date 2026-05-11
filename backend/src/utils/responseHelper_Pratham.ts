import { Response } from 'express';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse(
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
  pagination?: Pagination
): Response {
  const body: Record<string, unknown> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    body.pagination = pagination;
  }

  return res.status(statusCode).json(body);
}

export function errorResponse(
  res: Response,
  message: string,
  code: string,
  statusCode = 500,
  details?: unknown
): Response {
  const body: Record<string, unknown> = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    (body.error as Record<string, unknown>).details = details;
  }

  return res.status(statusCode).json(body);
}
