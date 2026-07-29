import { prisma } from "@/libs/prisma.js";

export class LinkRepository {
  async create(originalUrl: string, shortCode: string, userId: string) {
    return prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        userId,
      },
    });
  }

  async findById(id: string) {
    return prisma.link.findUnique({
      where: {
        id,
      },
    });
  }

  async findByShortCode(shortCode: string) {
    return prisma.link.findUnique({
      where: {
        shortCode,
      },
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.link.findMany({
      where: {
        userId,
      },
    });
  }

  async update(id: string, originalUrl: string, shortCode: string) {
    return prisma.link.update({
      where: {
        id,
      },
      data: {
        originalUrl,
        shortCode,
      },
    });
  }

  async delete(id: string) {
    return prisma.link.delete({
      where: {
        id,
      },
    });
  }
}
