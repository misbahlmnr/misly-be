import { AnalyticRepository } from "../analytics/analytic.repository.js";
import { LinkRepository } from "../links/link.repository.js";

export class OverviewService {
  private linkRepository = new LinkRepository();
  private analyticRepository = new AnalyticRepository();

  async getOverview(userId: string) {
    const [totalLinks, totalClicks, recentLinks] = await Promise.all([
      this.linkRepository.countByUserId(userId),
      this.analyticRepository.countByUserId(userId),
      this.linkRepository.findRecentByUserId(userId),
    ]);

    return {
      stats: {
        totalLinks,
        totalClicks,
        totalQrCodes: 0,
      },
      recentLinks,
    };
  }
}
