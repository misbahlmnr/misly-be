import { LinkStatus, type Link } from "@/generated/prisma/client.js";

type LinkWithCount = Link & {
  _count?: {
    LinkVisit: number;
  };
};

type LinkResponseDTO = {
  id: string;
  title: string | null;
  originalUrl: string;
  slug: string;
  shortUrl: string;
  status: "active" | "hidden";
  clickCount?: number;
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_TO_API: Record<LinkStatus, "active" | "hidden"> = {
  [LinkStatus.ACTIVE]: "active",
  [LinkStatus.HIDDEN]: "hidden",
};

export const linkToResponse = (link: LinkWithCount): LinkResponseDTO => {
  return {
    id: link.id,
    title: link.title,
    originalUrl: link.originalUrl,
    slug: link.slug,
    shortUrl: `${process.env.BASE_URL}/${link.slug}`,
    status: STATUS_TO_API[link.status],
    ...(link._count !== undefined
      ? { clickCount: link._count.LinkVisit }
      : {}),
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
};
