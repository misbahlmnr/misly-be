import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.types.js";
import { AnalyticService } from "./analytic.service.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { sendSuccess } from "@/utils/api-response.js";

export class AnalyticController {
  private analyticService = new AnalyticService();

  create = async (req: AuthRequest, res: Response) => {
    const { linkId } = req.params;
    const { ipAddress, userAgent, referrer } = req.body;

    if (!linkId) {
      throw new NotFoundError("Link not found");
    }

    const analytic = await this.analyticService.create(
      linkId as string,
      ipAddress,
      userAgent,
      referrer,
    );

    return sendSuccess({
      res,
      data: analytic,
      message: "Analytic created successfully",
      statusCode: 201,
    });
  };

  getTotalVisits = async (req: AuthRequest, res: Response) => {
    const { linkId } = req.params;

    if (!linkId) {
      throw new NotFoundError("link not found");
    }

    const totalVisits = await this.analyticService.getTotalVisits(
      linkId as string,
    );

    return sendSuccess({
      res,
      data: totalVisits,
      message: "Total visits fetched successfully",
      statusCode: 200,
    });
  };

  getStats = async (req: AuthRequest, res: Response) => {
    const { linkId } = req.params as { linkId: string };
    const period = (req.query.period as string) || "daily";

    if (!linkId) {
      throw new NotFoundError("link not found");
    }

    const stats = await this.analyticService.getStats(linkId, period);

    return sendSuccess({
      res,
      data: stats,
      message: "Statistics fetched successfully",
      statusCode: 200,
    });
  };
}
