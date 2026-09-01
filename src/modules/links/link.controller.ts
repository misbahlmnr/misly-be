import type { Request, Response } from "express";
import { LinkService } from "./link.service.js";
import { sendSuccess } from "@/utils/api-response.js";
import type { AuthRequest } from "../auth/auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { AnalyticService } from "../analytics/analytic.service.js";
import type { LinkStatus } from "@/generated/prisma/enums.js";

export class LinkController {
  private linkService = new LinkService();
  private analyticService = new AnalyticService();

  createLink = async (req: AuthRequest, res: Response) => {
    const { originalUrl, title, customSlug } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const link = await this.linkService.createLink(
      originalUrl,
      userId,
      title,
      customSlug,
    );

    return sendSuccess({
      res,
      data: link,
      message: "Link created successfully",
      statusCode: 201,
    });
  };

  getLinks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const query = req.query.q as string;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = (req.query.status as string) || "active";
    const sort = (req.query.sort as string) || "desc";

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { data, meta } = await this.linkService.getLinks(
      userId,
      page,
      limit,
      query,
      status,
      sort,
    );

    return sendSuccess({
      res,
      data,
      meta,
      message: "Links fetched successfully",
      statusCode: 200,
    });
  };

  getLinkById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const link = await this.linkService.getLinkById(id as string);

    return sendSuccess({
      res,
      data: link,
      message: "Link fetched successfully",
      statusCode: 200,
    });
  };

  editLink = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { originalUrl, title, status } = req.body;

    const link = await this.linkService.editLink(
      id as string,
      originalUrl,
      userId,
      title,
      status,
    );

    return sendSuccess({
      res,
      data: link,
      message: "Link edited successfully",
      statusCode: 200,
    });
  };

  updateLinkStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { status } = req.body;
    const link = await this.linkService.updateLinkStatus(
      id as string,
      userId,
      status,
    );

    return sendSuccess({
      res,
      data: link,
      message: "Link status updated successfully",
      statusCode: 200,
    });
  };

  deleteLink = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    await this.linkService.deleteLink(id as string, userId);

    return sendSuccess({
      res,
      data: null,
      message: "Link deleted successfully",
      statusCode: 200,
    });
  };

  redirectBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug) {
      throw new NotFoundError("Slug is required");
    }

    const link = await this.linkService.getLinkBySlug(slug as string);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    await this.analyticService.create(
      link.id,
      req.ip || null,
      req.headers["user-agent"] || null,
      req.headers["referer"] || null,
    );

    res.redirect(link.originalUrl);
  };
}
