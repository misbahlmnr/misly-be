import { ConflictError } from "@/errors/conflict-error.js";
import { LinkRepository } from "./link.repository.js";
import { customAlphabet } from "nanoid";
import { CHARACTERS } from "@/common/constant.js";
import { linkToResponse } from "./link.mapper.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";

export class LinkService {
  private linkRepository = new LinkRepository();

  async createLink(originalUrl: string, userId: string) {
    // TODO: Improve short code generation for production.
    // Currently we generate a random short code and rely on the database's unique constraint.
    // In the future, implement a retry mechanism to handle the rare case of a collision.
    const shortCode = customAlphabet(CHARACTERS, 6)();

    const existingLink = await this.linkRepository.findByShortCode(shortCode);

    if (existingLink) {
      throw new ConflictError("Short code already in use");
    }

    const link = await this.linkRepository.create(
      originalUrl,
      shortCode,
      userId,
    );

    return linkToResponse(link);
  }

  async getLinks(userId: string) {
    return (await this.linkRepository.findManyByUserId(userId)).map(
      linkToResponse,
    );
  }

  async getLinkById(id: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return linkToResponse(link);
  }

  async getLinkByShortCode(shortCode: string) {
    const link = await this.linkRepository.findByShortCode(shortCode);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return linkToResponse(link);
  }

  async editLink(id: string, originalUrl: string, userId: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    if (link.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const updatedLink = await this.linkRepository.update(id, originalUrl);

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
