import { prisma } from "@/lib/prisma.js";

export class AnalyticRepository {
  async create(
    linkId: string,
    ipAddress: string | null,
    userAgent: string | null,
    referrer: string | null,
  ) {
    return prisma.linkVisit.create({
      data: {
        linkId,
        ipAddress,
        userAgent,
        referrer,
      },
    });
  }

  async countByLinkId(linkId: string) {
    return prisma.linkVisit.count({
      where: {
        linkId,
      },
    });
  }

  async getVisitsFromDate(linkId: string, startDate: Date) {
    return prisma.linkVisit.findMany({
      where: {
        linkId,
        visitedAt: {
          gte: startDate,
        },
      },
      select: {
        visitedAt: true,
      },
      orderBy: {
        visitedAt: "asc",
      },
    });
  }

  async countByLinkIdAndDateRange(
    linkId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return prisma.linkVisit.count({
      where: {
        linkId,
        visitedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
