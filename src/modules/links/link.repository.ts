import { LinkStatus, type Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

const STATUS_MAP: Record<string, LinkStatus> = {
  active: LinkStatus.ACTIVE,
  hidden: LinkStatus.HIDDEN,
};

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

  async findManyByUserId(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    status = "active",
    sort = "desc",
  ) {
    const skip = (page - 1) * limit;

    const linkStatus = STATUS_MAP[status] ?? LinkStatus.ACTIVE;

    const whereClause: Prisma.LinkWhereInput = {
      userId,
      status: linkStatus,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const orderBy: Prisma.LinkOrderByWithRelationInput =
      sort === "clicks"
        ? { LinkVisit: { _count: "desc" } }
        : { createdAt: sort as Prisma.SortOrder };

    const [links, totalData] = await prisma.$transaction([
      prisma.link.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          originalUrl: true,
          slug: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { LinkVisit: true },
          },
        },
      }),

      prisma.link.count({
        where: whereClause,
      }),
    ]);

    return { links, totalData };
  }

  async update(
    id: string,
    originalUrl: string,
    title?: string | null,
    status?: string,
  ) {
    return prisma.link.update({
      where: {
        id,
      },
      data: {
        originalUrl,
        ...(title !== undefined ? { title } : {}),
        ...(status !== undefined ? { status: STATUS_MAP[status] } : {}),
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

  async countByUserId(userId: string) {
    return prisma.link.count({
      where: {
        userId,
      },
    });
  }

  async findRecentByUserId(userId: string) {
    return prisma.link.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  }
}
