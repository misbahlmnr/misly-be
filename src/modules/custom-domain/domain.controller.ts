import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.types.js";
import { DomainService } from "./domain.service.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { sendSuccess } from "@/utils/api-response.js";

export class DomainController {
  private domainService = new DomainService();

  addDomain = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      const { domainName, dnsTarget, dnsRecordType, status } = req.body;

      const domain = await this.domainService.addDomain(
        userId as string,
        domainName,
        dnsTarget,
        dnsRecordType,
        status,
      );

      return sendSuccess({
        res,
        data: domain,
        message: "Domain added successfully",
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getAllDomain = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;

    try {
      const domains = await this.domainService.getAllDomains(userId);

      return sendSuccess({
        res,
        data: domains,
        message: "Domains fetched successfully",
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  updateDomain = async (req: AuthRequest, res: Response) => {
    const domainId = req.params.id as string;
    const { domainName, dnsTarget, dnsRecordType, status } = req.body;

    try {
      const domain = await this.domainService.updateDomain(
        domainId,
        domainName,
        dnsTarget,
        dnsRecordType,
        status,
      );

      return sendSuccess({
        res,
        data: domain,
        message: "Domain updated successfully",
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  deleteDomain = async (req: AuthRequest, res: Response) => {
    const domainId = req.params.id as string;

    try {
      const domain = await this.domainService.deleteDomain(domainId);
      return sendSuccess({
        res,
        data: domain,
        message: "Domain deleted successfully",
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };
}
