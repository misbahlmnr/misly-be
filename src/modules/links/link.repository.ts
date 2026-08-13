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

  async findManyByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [links, totalData] = await prisma.$transaction([
      prisma.link.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          originalUrl: true,
          slug: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { LinkVisit: true },
          },
        },
      }),

      prisma.linkVisit.count({
        where: { link: { userId } },
      }),
    ]);

    return { links, totalData };
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
