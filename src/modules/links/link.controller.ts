import type { Response } from "express";
import type { LinkService } from "./link.service.js";
import { sendSuccess } from "@/utils/api-response.js";
import type { AuthRequest } from "../auth/auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";

export class LinkController {
  constructor(private readonly linkService: LinkService) {
    this.linkService = linkService;
  }

  createLink = async (req: AuthRequest, res: Response) => {
    const { originalUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const link = await this.linkService.createLink(originalUrl, userId);

    return sendSuccess({
      res,
      data: link,
      message: "Link created successfully",
      statusCode: 201,
    });
  };

  getLinks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const links = await this.linkService.getLinks(userId);

    return sendSuccess({
      res,
      data: links,
      message: "Links fetched successfully",
      statusCode: 200,
    });
  };
}
