import { CHARACTERS } from "@/common/constant.js";
import { ConflictError } from "@/errors/conflict-error.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { customAlphabet } from "nanoid";
import { DomainService } from "../custom-domain/domain.service.js";
import { LinkRepository } from "../links/link.repository.js";
import { qrCodeToResponse } from "./qr-code.mapper.js";
import { QrCodeRepository } from "./qr-code.repository.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";

const MASTER_DOMAIN = "misly.link";

export class QrCodeService {
  private qrCodeRepository = new QrCodeRepository();
  private domainService = new DomainService();
  private linkRepository = new LinkRepository();

  async getQrCodes(userId: string) {
    const qrCodes = await this.qrCodeRepository.findManyByUserId(userId);
    return qrCodes.map((qrCode) => qrCodeToResponse(qrCode));
  }

  async createQrCode(
    userId: string,
    destinationUrl: string,
    title?: string | null,
    styles?: Prisma.InputJsonValue | null,
    logoUrl?: string | null,
  ) {
    const masterDomain =
      await this.domainService.getDomainByName(MASTER_DOMAIN);

    if (!masterDomain) {
      throw new NotFoundError("Master domain not found");
    }

    let link = await this.linkRepository.findByUserUrlAndDomain(
      userId,
      destinationUrl,
      masterDomain.id,
    );

    if (!link) {
      const slug = customAlphabet(CHARACTERS, 6)();
      const existingLink = await this.linkRepository.findByDomainAndSlug(
        masterDomain.id,
        slug,
      );

      if (existingLink) {
        throw new ConflictError("Slug already in use");
      }

      link = await this.linkRepository.create(
        destinationUrl,
        slug,
        userId,
        title,
        masterDomain.id,
      );
    }

    const shortUrl = `https://${masterDomain.domainName}/${link.slug}`;

    const qrCode = await this.qrCodeRepository.create({
      userId,
      linkId: link.id,
      destinationUrl: shortUrl,
      title: title ?? link.title,
      ...(styles !== undefined ? { styles } : {}),
      ...(logoUrl !== undefined ? { logoUrl } : {}),
    });

    return qrCodeToResponse(qrCode, shortUrl);
  }

  async updateQrCode(
    userId: string,
    qrCodeId: string,
    title?: string | null,
    destinationUrl?: string | null,
    styles?: Prisma.InputJsonValue | null,
    logoUrl?: string | null,
  ) {
    const qrCode = await this.qrCodeRepository.findById(qrCodeId);

    if (!qrCode) {
      throw new NotFoundError("QR code not found");
    }
    if (qrCode.userId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to update this QR code",
      );
    }

    const updatedQrCode = await this.qrCodeRepository.update(qrCodeId, {
      title: title ?? qrCode.title,
      destinationUrl: destinationUrl ?? qrCode.destinationUrl,
      styles: styles ?? qrCode.styles,
      logoUrl: logoUrl ?? qrCode.logoUrl,
    });
    return qrCodeToResponse(updatedQrCode);
  }

  async deleteQrCode(userId: string, qrCodeId: string) {
    const qrCode = await this.qrCodeRepository.findById(qrCodeId);
    if (!qrCode) {
      throw new NotFoundError("QR code not found");
    }
    if (qrCode.userId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this QR code",
      );
    }
    await this.qrCodeRepository.delete(qrCodeId);
  }
}
