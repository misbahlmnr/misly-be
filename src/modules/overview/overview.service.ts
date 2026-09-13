import { AnalyticRepository } from "../analytics/analytic.repository.js";
import { linkToResponse } from "../links/link.mapper.js";
import { LinkRepository } from "../links/link.repository.js";
import { QrCodeRepository } from "../qr-codes/qr-code.repository.js";

export class OverviewService {
  private linkRepository = new LinkRepository();
  private analyticRepository = new AnalyticRepository();
  private qrCodeRepository = new QrCodeRepository();

  async getOverview(userId: string) {
    const [totalLinks, totalClicks, totalQrCodes, recentLinks] =
      await Promise.all([
        this.linkRepository.countByUserId(userId),
        this.analyticRepository.countByUserId(userId),
        this.qrCodeRepository.countByUserId(userId),
        this.linkRepository.findRecentByUserId(userId),
      ]);

    return {
      stats: {
        totalLinks,
        totalClicks,
        totalQrCodes,
      },
      recentLinks: recentLinks.map((link) => linkToResponse(link)),
    };
  }
}
