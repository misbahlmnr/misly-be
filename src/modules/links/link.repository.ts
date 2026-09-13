import { LinkStatus, type Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

const STATUS_MAP: Record<string, LinkStatus> = {
  active: LinkStatus.ACTIVE,
  hidden: LinkStatus.HIDDEN,
};

const domainInclude = {
  domains: {
    select: {
      domainName: true,
    },
  },
} as const;

const linkListSelect = {
  id: true,
  originalUrl: true,
  slug: true,
  title: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  ...domainInclude,
  _count: {
    select: { LinkVisit: true },
  },
} as const;

export class LinkRepository {
  async create(
    originalUrl: string,
    slug: string,
    userId: string,
    title: string | null | undefined,
    domainId: string,
  ) {
    return prisma.link.create({
      data: {
        originalUrl,
        slug,
        userId,
        domainId,
        ...(title !== undefined ? { title } : {}),
      },
      include: domainInclude,
    });
  }

  async findById(id: string) {
    return prisma.link.findUnique({
      where: {
        id,
      },
      include: domainInclude,
    });
  }

  async findBySlug(slug: string) {
    return prisma.link.findFirst({
      where: {
        slug,
      },
      include: domainInclude,
    });
  }

  async findByDomainAndSlug(domainId: string, slug: string) {
    return prisma.link.findUnique({
      where: {
        domainId_slug: {
          domainId,
          slug,
        },
      },
      include: domainInclude,
    });
  }

  async findByUserUrlAndDomain(
    userId: string,
    originalUrl: string,
    domainId: string,
  ) {
    return prisma.link.findFirst({
      where: {
        userId,
        originalUrl,
        domainId,
      },
      include: domainInclude,
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
        select: linkListSelect,
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
      include: domainInclude,
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.link.update({
      where: {
        id,
      },
      data: { status: STATUS_MAP[status] ?? LinkStatus.ACTIVE },
      include: domainInclude,
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
      select: linkListSelect,
    });
  }
}
