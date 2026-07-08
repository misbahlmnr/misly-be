import { prisma } from "@/libs/prisma.js";

export class UserRepository {
  async create(email: string, password: string) {
    return prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}
