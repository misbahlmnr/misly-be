import { ConflictError } from "@/errors/conflict-error.js";
import type { LinkRepository } from "./link.repository.js";
import { customAlphabet } from "nanoid";
import { CHARACTERS } from "@/common/constant.js";

export class LinkService {
  constructor(private readonly linkRepository: LinkRepository) {
    this.linkRepository = linkRepository;
  }

  async createLink(originalUrl: string, userId: string) {
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

    return {
      ...link,
      shortUrl: `${process.env.BASE_URL}/${link.shortCode}`,
    };
  }
}
