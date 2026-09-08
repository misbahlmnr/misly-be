import { CHARACTERS, MASTER_DOMAIN } from "@/common/constant.js";
import { ConflictError } from "@/errors/conflict-error.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { ValidationError } from "@/errors/validation-error.js";
import { customAlphabet } from "nanoid";
import { DomainService } from "../custom-domain/domain.service.js";
import { linkToResponse } from "./link.mapper.js";
import { LinkRepository } from "./link.repository.js";

const VALID_STATUSES = ["active", "hidden"] as const;
const VALID_ORDERS = ["desc", "asc", "clicks"] as const;

type LinkStatusFilter = (typeof VALID_STATUSES)[number];
type LinkOrder = (typeof VALID_ORDERS)[number];

function normalizeRequestHost(host: string | undefined) {
  if (!host) return "";

  const hostname = host.split(",")[0]?.trim() ?? "";

  return hostname
    .replace(/:\d+$/, "")
    .replace(/^www\./i, "")
    .toLowerCase();
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export class LinkService {
  private linkRepository = new LinkRepository();
  private domainService = new DomainService();

  private async getMasterDomain() {
    const masterDomain = await this.domainService.getDomainByName(MASTER_DOMAIN);

    if (!masterDomain) {
      throw new NotFoundError("Master domain not found");
    }

    return masterDomain;
  }

  async createLink(
    originalUrl: string,
    userId: string,
    title?: string | null,
    customSlug?: string | null | undefined,
  ) {
    const masterDomain = await this.getMasterDomain();
    // TODO: Improve slug generation for production.
    // Currently we generate a random slug and rely on the database's unique constraint.
    // In the future, implement a retry mechanism to handle the rare case of a collision.
    const slug = customSlug || customAlphabet(CHARACTERS, 6)();

    const existingLink = await this.linkRepository.findByDomainAndSlug(
      masterDomain.id,
      slug,
    );

    if (existingLink) {
      throw new ConflictError("Slug already in use");
    }

    const link = await this.linkRepository.create(
      originalUrl,
      slug,
      userId,
      title,
      masterDomain.id,
    );

    return linkToResponse(link);
  }

  async getLinks(
    userId: string,
    page = 1,
    limit = 10,
    search?: string,
    status = "active",
    sort = "desc",
  ) {
    if (!VALID_STATUSES.includes(status as LinkStatusFilter)) {
      throw new ValidationError(
        "Invalid status. Allowed values: active, hidden",
      );
    }

    if (!VALID_ORDERS.includes(sort as LinkOrder)) {
      throw new ValidationError(
        "Invalid order. Allowed values: desc, asc, clicks",
      );
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    const { links, totalData } = await this.linkRepository.findManyByUserId(
      userId,
      safePage,
      safeLimit,
      search,
      status,
      sort,
    );

    const totalPages = Math.ceil(totalData / safeLimit);

    return {
      data: links.map((link) => linkToResponse(link)),
      meta: {
        page: safePage,
        limit: safeLimit,
        totalPages,
        totalData,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    };
  }

  async getLinkById(id: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return linkToResponse(link);
  }

  async getLinkForRedirect(host: string | undefined, slug: string) {
    const hostname = normalizeRequestHost(host);
    const domain =
      hostname && !isLocalHost(hostname)
        ? await this.domainService.getDomainByName(hostname)
        : null;
    const resolvedDomain = domain ?? (await this.getMasterDomain());

    const link = await this.linkRepository.findByDomainAndSlug(
      resolvedDomain.id,
      slug,
    );

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return link;
  }

  async editLink(
    id: string,
    originalUrl: string,
    userId: string,
    title?: string | null,
    status?: string,
  ) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    if (link.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status as LinkStatusFilter)
    ) {
      throw new ValidationError(
        "Invalid status. Allowed values: active, hidden",
      );
    }

    const updatedLink = await this.linkRepository.update(
      id,
      originalUrl,
      title,
      status,
    );

    return linkToResponse(updatedLink);
  }

  async updateLinkStatus(id: string, userId: string, status: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    if (link.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status as LinkStatusFilter)
    ) {
      throw new ValidationError(
        "Invalid status. Allowed values: active, hidden",
      );
    }

    const updatedLink = await this.linkRepository.updateStatus(id, status);

    return linkToResponse(updatedLink);
  }

  async deleteLink(id: string, userId: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    if (link.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    await this.linkRepository.delete(id);
  }
}
