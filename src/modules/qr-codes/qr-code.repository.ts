import { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

export class QrCodeRepository {
  async findById(id: string) {
    return prisma.qrCode.findUnique({
      where: { id },
    });
  }

  async create(data: {
    userId: string;
    linkId: string;
    destinationUrl: string;
    title?: string | null;
    styles?: Prisma.InputJsonValue | null;
    logoUrl?: string | null;
  }) {
    return prisma.qrCode.create({
      data: {
        userId: data.userId,
        linkId: data.linkId,
        destinationUrl: data.destinationUrl,
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.styles !== undefined
          ? { styles: data.styles === null ? Prisma.JsonNull : data.styles }
          : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
      },
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.qrCode.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    data: {
      title?: string | null;
      destinationUrl?: string;
      styles?: Prisma.InputJsonValue | null;
      logoUrl?: string | null;
    },
  ) {
    return prisma.qrCode.update({
      where: {
        id,
      },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.styles !== undefined
          ? { styles: data.styles === null ? Prisma.JsonNull : data.styles }
          : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
        ...(data.destinationUrl !== undefined
          ? { destinationUrl: data.destinationUrl }
          : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.qrCode.delete({
      where: { id },
    });
  }
}
