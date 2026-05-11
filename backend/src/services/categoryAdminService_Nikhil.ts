import prisma from '../config/database_Preetam';

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'category';
}

export class CategoryAdminService {
  static async create(name: string, icon?: string | null) {
    let slug = slugify(name);
    let n = 0;
    while (await prisma.category.findUnique({ where: { slug } })) {
      n += 1;
      slug = `${slugify(name)}-${n}`;
    }
    return prisma.category.create({
      data: { name: name.trim(), slug, icon: icon?.trim() || null },
    });
  }

  static async update(id: string, name: string, icon?: string | null) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Category not found');

    const nextName = name.trim();
    let nextSlug = existing.slug;
    if (nextName !== existing.name) {
      nextSlug = slugify(nextName);
      let n = 0;
      while (
        await prisma.category.findFirst({
          where: { slug: nextSlug, NOT: { id } },
        })
      ) {
        n += 1;
        nextSlug = `${slugify(nextName)}-${n}`;
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        name: nextName,
        slug: nextSlug,
        ...(icon !== undefined ? { icon: icon?.trim() || null } : {}),
      },
    });
  }

  static async remove(id: string) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Category not found');

    await prisma.event.updateMany({
      where: { category_id: id },
      data: { category_id: null },
    });

    await prisma.category.delete({ where: { id } });
    return { id };
  }
}
