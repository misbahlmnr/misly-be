import type { Link, QrCode } from "@/generated/prisma/client.js";

type QrCodeResponseDTO = {
  id: string;
  title: string | null;
  destinationUrl: string;
  styles: unknown;
  logoUrl: string | null;
  shortUrl: string;
  linkId: string;
  createdAt: Date;
  updatedAt: Date;
  link: Link | null;
};

type QrCodeWithLink = QrCode & { link?: Link | null };

export const qrCodeToResponse = (
  qrCode: QrCodeWithLink,
  shortUrl?: string,
): QrCodeResponseDTO => {
  return {
    id: qrCode.id,
    title: qrCode.title,
    destinationUrl: qrCode.destinationUrl,
    styles: qrCode.styles,
    logoUrl: qrCode.logoUrl,
    shortUrl: shortUrl ?? qrCode.destinationUrl,
    linkId: qrCode.linkId,
    createdAt: qrCode.createdAt,
    updatedAt: qrCode.updatedAt,
    link: qrCode.link ?? null,
  };
};
