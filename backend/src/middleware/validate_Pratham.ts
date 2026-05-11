import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { errorResponse } from '../utils/responseHelper_Pratham';

export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      const zodError = parsed.error as ZodError;
      errorResponse(res, 'Validation failed', 'VALIDATION_ERROR', 400, formatZodIssues(zodError));
      return;
    }

    if (source === 'body') {
      req.body = parsed.data as Request['body'];
    } else if (source === 'query') {
      req.query = parsed.data as Request['query'];
    } else {
      req.params = parsed.data as Request['params'];
    }

    next();
  };
}

function formatZodIssues(error: ZodError): { fields: Record<string, string[]>; issues: ZodError['issues'] } {
  const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const fields: Record<string, string[]> = {};

  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      fields[key] = messages;
    }
  }

  return {
    fields,
    issues: error.issues,
  };
}
