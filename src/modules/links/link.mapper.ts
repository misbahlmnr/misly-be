import type { Link } from "@/generated/prisma/client.js";

type LinkResponseDTO = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export const linkToResponse = (link: Link): LinkResponseDTO => {
  return {
    id: link.id,
    originalUrl: link.originalUrl,
    shortCode: link.shortCode,
    shortUrl: `${process.env.BASE_URL}/${link.shortCode}`,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
};
