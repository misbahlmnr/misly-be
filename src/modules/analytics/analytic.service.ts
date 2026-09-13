import { NotFoundError } from "@/errors/not-found-error.js";
import { ValidationError } from "@/errors/validation-error.js";
import { LinkRepository } from "../links/link.repository.js";
import { AnalyticRepository } from "./analytic.repository.js";
import {
  buildBrowsers,
  buildDevices,
  buildSeries,
  buildSources,
  comparisonLabel,
  countUniqueVisitors,
  isAnalyticRange,
  normalizeAnalyticRange,
  percentChange,
  resolveRangeWindow,
} from "./analytic.utils.js";

export class AnalyticService {
  private analyticRepository = new AnalyticRepository();
  private linkRepository = new LinkRepository();

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

  async getStats(linkId: string, userId: string, rangeInput: string) {
    const range = normalizeAnalyticRange(rangeInput);

    if (!isAnalyticRange(range)) {
      throw new ValidationError("Invalid range. Allowed values: 7d, 30d, all");
    }

    const link = await this.linkRepository.findById(linkId);

    if (!link || link.userId !== userId) {
      throw new NotFoundError("Link not found");
    }

    const window = resolveRangeWindow(range);
    const visits = await this.analyticRepository.getVisitsFromDate(
      linkId,
      window.previousStart,
    );

    const currentVisits = visits.filter(
      (visit) => visit.visitedAt >= window.start,
    );
    const previousVisits = visits.filter(
      (visit) => visit.visitedAt < window.start,
    );

    const totalClicks = currentVisits.length;
    const uniqueVisitors = countUniqueVisitors(currentVisits);
    const sources = buildSources(currentVisits, totalClicks);
    const topSource = sources[0];

    return {
      range,
      comparisonLabel: comparisonLabel(range),
      totalClicks,
      uniqueVisitors,
      clicksChange: percentChange(totalClicks, previousVisits.length),
      visitorsChange: percentChange(
        uniqueVisitors,
        countUniqueVisitors(previousVisits),
      ),
      topCountry: { name: "", share: 0 },
      topReferrer: topSource
        ? { name: topSource.name, share: topSource.share }
        : { name: "", share: 0 },
      locations: [],
      sources,
      devices: buildDevices(currentVisits, totalClicks),
      browsers: buildBrowsers(currentVisits, totalClicks),
      series: buildSeries(currentVisits, window),
    };
  }
}
