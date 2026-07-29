import { ConflictError } from "@/errors/conflict-error.js";
import type { LinkRepository } from "./link.repository.js";
import { customAlphabet } from "nanoid";
import { CHARACTERS } from "@/common/constant.js";
import { linkToResponse } from "./link.mapper.js";

export class LinkService {
  constructor(private readonly linkRepository: LinkRepository) {
    this.linkRepository = linkRepository;
  }

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
}
