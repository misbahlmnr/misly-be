import type { Link } from "@/generated/prisma/client.js";

type LinkResponseDTO = {
  id: string;
  title: string | null;
  originalUrl: string;
  slug: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export const linkToResponse = (link: Link): LinkResponseDTO => {
  return {
    id: link.id,
    title: link.title,
    originalUrl: link.originalUrl,
    slug: link.slug,
    shortUrl: `${process.env.BASE_URL}/${link.slug}`,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
};
