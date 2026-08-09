import type { Request, Response } from "express";
import { LinkService } from "./link.service.js";
import { sendSuccess } from "@/utils/api-response.js";
import type { AuthRequest } from "../auth/auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { NotFoundError } from "@/errors/not-found-error.js";

export class LinkController {
  private linkService = new LinkService();

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

    const { originalUrl, title } = req.body;

    const link = await this.linkService.editLink(
      id as string,
      originalUrl,
      userId,
      title,
    );

    return sendSuccess({
      res,
      data: link,
      message: "Link edited successfully",
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

    res.redirect(link.originalUrl);
  };
}
