import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { sendSuccess } from "@/utils/api-response.js";
import type { Request, Response } from "express";
import type { AuthRequest } from "../auth/auth.types.js";
import { QrCodeService } from "./qr-code.service.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { LinkStatus } from "@/generated/prisma/client.js";
import { AnalyticService } from "../analytics/analytic.service.js";

export class QrCodeController {
  private qrCodeService = new QrCodeService();
  private analyticService = new AnalyticService();

  getQrCodes = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const qrCodes = await this.qrCodeService.getQrCodes(userId);

    return sendSuccess({
      res,
      data: qrCodes,
      message: "QR codes fetched successfully",
      statusCode: 200,
    });
  };

  createQrCode = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { title, destinationUrl, styles, logoUrl } = req.body;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const qrCode = await this.qrCodeService.createQrCode(
      userId,
      destinationUrl,
      title,
      styles,
      logoUrl,
    );

    return sendSuccess({
      res,
      data: qrCode,
      message: "QR code created successfully",
      statusCode: 201,
    });
  };

  updateQrCode = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const qrCodeId = req.params.id as string;

    const { title, destinationUrl, styles, logoUrl } = req.body;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const updatedQrCode = await this.qrCodeService.updateQrCode(
      userId,
      qrCodeId,
      title,
      destinationUrl,
      styles,
      logoUrl,
    );

    return sendSuccess({
      res,
      data: updatedQrCode,
      message: "QR code updated successfully",
      statusCode: 200,
    });
  };

  deleteQrCode = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const qrCodeId = req.params.id as string;

    await this.qrCodeService.deleteQrCode(userId, qrCodeId);

    return sendSuccess({
      res,
      data: null,
      message: "QR code deleted successfully",
      statusCode: 200,
    });
  };

  resolveQrCode = async (req: Request, res: Response) => {
    const qrCodeId = req.params.id as string;

    const qrCode = await this.qrCodeService.getQrCodeById(qrCodeId);

    if (!qrCode || !qrCode.link || qrCode.link.status === LinkStatus.HIDDEN) {
      throw new NotFoundError("QR code not found");
    }

    const { ip, isPrefetch } = this.qrCodeService.getAdditionalReqContext(req);

    if (!isPrefetch) {
      await this.qrCodeService.createScanAnalytic(
        qrCodeId,
        ip,
        req.headers["user-agent"] ?? null,
        req.headers["referer"] ?? null,
      );

      await this.analyticService.create(
        qrCode.link.id,
        ip,
        req.headers["user-agent"] ?? null,
        req.headers["referer"] ?? null,
      );
    }

    return sendSuccess({
      res,
      data: { originalUrl: qrCode.link.originalUrl },
      message: "QR code resolved successfully",
      statusCode: 200,
    });
  };
}
