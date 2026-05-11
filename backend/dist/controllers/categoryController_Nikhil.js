"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listCategories(_req, res) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        (0, responseHelper_Pratham_1.successResponse)(res, categories, 'Categories retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to list categories', 'LIST_CATEGORIES_ERROR', error.statusCode || 500);
    }
}
