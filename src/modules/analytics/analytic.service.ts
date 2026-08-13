import { ValidationError } from "@/errors/validation-error.js";
import { AnalyticRepository } from "./analytic.repository.js";
import { subDays, format, subWeeks, subMonths } from "date-fns";

export class AnalyticService {
  private analyticRepository = new AnalyticRepository();

  async create(
    linkId: string,
    ipAddress: string | null,
    userAgent: string | null,
    referrer: string | null,
  ) {
    return this.analyticRepository.create(
      linkId,
      ipAddress,
      userAgent,
      referrer,
    );
  }

  async getTotalVisits(linkId: string) {
    return this.analyticRepository.countByLinkId(linkId);
  }

  async getStats(linkId: string, period: string) {
    const now = new Date();
    let startDate: Date;
    let formatKey: (date: Date) => string;

    switch (period) {
      case "daily":
        startDate = subDays(now, 7);
        formatKey = (date: Date) => format(date, "yyyy-MM-dd");
        break;

      case "weekly":
        startDate = subWeeks(now, 4);
        formatKey = (date: Date) => format(date, "yyyy-ww");
        break;

      case "monthly":
        startDate = subMonths(now, 12);
        formatKey = (date: Date) => format(date, "yyyy-MM");
        break;

      default:
        throw new ValidationError("Invalid period");
    }

    const visits = await this.analyticRepository.getVisitsFromDate(
      linkId,
      startDate,
    );

    const statsMap = visits.reduce<Record<string, number>>((acc, curr) => {
      const key = formatKey(curr.visitedAt);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const stats = Object.entries(statsMap).map(([date, count]) => ({
      date,
      count,
    }));

    return stats;
  }
}
