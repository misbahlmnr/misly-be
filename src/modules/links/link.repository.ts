import { prisma } from "@/lib/prisma.js";

export class LinkRepository {
  async create(
    originalUrl: string,
    slug: string,
    userId: string,
    title?: string | null,
  ) {
    return prisma.link.create({
      data: {
        originalUrl,
        slug,
        userId,
        ...(title !== undefined ? { title } : {}),
      },
    });
  }

  async findById(id: string) {
    return prisma.link.findUnique({
      where: {
        id,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.link.findUnique({
      where: {
        slug,
      },
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.link.findMany({
      where: {
        userId,
      },
    });
  }

  async update(id: string, originalUrl: string, title?: string | null) {
    return prisma.link.update({
      where: {
        id,
      },
      data: {
        originalUrl,
        ...(title !== undefined ? { title } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.link.delete({
      where: {
        id,
      },
    });
  }
}
