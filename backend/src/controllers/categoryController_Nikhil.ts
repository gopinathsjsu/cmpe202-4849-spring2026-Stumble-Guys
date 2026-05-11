import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper_Pratham';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listCategories(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    successResponse(res, categories, 'Categories retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to list categories', 'LIST_CATEGORIES_ERROR', error.statusCode || 500);
  }
}
