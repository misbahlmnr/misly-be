import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.types.js";
import { ValidationError } from "@/errors/validation-error.js";
import { sendSuccess } from "@/utils/api-response.js";
import { OverviewService } from "./overview.service.js";

export class OverviewController {
  private overviewService = new OverviewService();

  getOverview = async (req: AuthRequest, res: Response) => {
    const userId = req?.user?.userId;

    console.log(userId);

    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const overview = await this.overviewService.getOverview(userId);

    return sendSuccess({
      res,
      data: overview,
      message: "Overview fetched successfully",
      statusCode: 200,
    });
  };
}
