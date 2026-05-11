"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryAdminService = void 0;
const database_Preetam_1 = __importDefault(require("../config/database_Preetam"));
function slugify(name) {
    const base = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || 'category';
}
class CategoryAdminService {
    static async create(name, icon) {
        let slug = slugify(name);
        let n = 0;
        while (await database_Preetam_1.default.category.findUnique({ where: { slug } })) {
            n += 1;
            slug = `${slugify(name)}-${n}`;
        }
        return database_Preetam_1.default.category.create({
            data: { name: name.trim(), slug, icon: icon?.trim() || null },
        });
    }
    static async update(id, name, icon) {
        const existing = await database_Preetam_1.default.category.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Category not found');
        const nextName = name.trim();
        let nextSlug = existing.slug;
        if (nextName !== existing.name) {
            nextSlug = slugify(nextName);
            let n = 0;
            while (await database_Preetam_1.default.category.findFirst({
                where: { slug: nextSlug, NOT: { id } },
            })) {
                n += 1;
                nextSlug = `${slugify(nextName)}-${n}`;
            }
        }
        return database_Preetam_1.default.category.update({
            where: { id },
            data: {
                name: nextName,
                slug: nextSlug,
                ...(icon !== undefined ? { icon: icon?.trim() || null } : {}),
            },
        });
    }
    static async remove(id) {
        const existing = await database_Preetam_1.default.category.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Category not found');
        await database_Preetam_1.default.event.updateMany({
            where: { category_id: id },
            data: { category_id: null },
        });
        await database_Preetam_1.default.category.delete({ where: { id } });
        return { id };
    }
}
exports.CategoryAdminService = CategoryAdminService;
