import { MASTER_DOMAIN } from "@/common/constant.js";
import { LinkStatus } from "@/generated/prisma/client.js";

type LinkWithCount = {
  id: string;
  title: string | null;
  originalUrl: string;
  slug: string;
  status: LinkStatus;
  createdAt: Date;
  updatedAt: Date;
  domains?: {
    domainName: string;
  } | null;
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

function isLocalHost(host: string) {
  const hostname = host.replace(/:\d+$/, "").toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function buildShortUrl(domainName: string, slug: string) {
  const host = (process.env.SHORT_DOMAIN || domainName)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
  const protocol = isLocalHost(host) ? "http" : "https";

  return `${protocol}://${host}/${slug}`;
}

export const linkToResponse = (link: LinkWithCount): LinkResponseDTO => {
  const domainName = link.domains?.domainName || MASTER_DOMAIN;

  return {
    id: link.id,
    title: link.title,
    originalUrl: link.originalUrl,
    slug: link.slug,
    shortUrl: buildShortUrl(domainName, link.slug),
    status: STATUS_TO_API[link.status],
    ...(link._count !== undefined
      ? { clickCount: link._count.LinkVisit }
      : {}),
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
};
