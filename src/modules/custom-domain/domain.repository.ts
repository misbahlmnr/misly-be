import type { DnsRecordType, DomainStatus } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

export class DomainRepository {
  async getDomainById(domainId: string) {
    return await prisma.domain.findUnique({
      where: {
        id: domainId,
      },
    });
  }

  async getDomainByUserId(userId: string) {
    return await prisma.domain.findMany({
      where: {
        userId,
      },
    });
  }

  async getDomainByName(domainName: string) {
    return await prisma.domain.findUnique({
      where: {
        domainName,
      },
    });
  }

  async addDomain(
    userId: string,
    domainName: string,
    dnsTarget: string,
    dnsRecordType: string,
    status: string,
    verifiedAt: Date | null,
  ) {
    return await prisma.domain.create({
      data: {
        userId,
        domainName,
        dnsTarget,
        dnsRecordType: dnsRecordType.toUpperCase() as DnsRecordType,
        status: status.toUpperCase() as DomainStatus,
        verifiedAt,
      },
    });
  }

  async update(
    domainId: string,
    domainName: string,
    dnsTarget: string,
    dnsRecordType: string,
    status: string,
    verifiedAt: Date | null,
  ) {
    return await prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        domainName,
        dnsTarget,
        dnsRecordType: dnsRecordType.toUpperCase() as DnsRecordType,
        status: status.toUpperCase() as DomainStatus,
        verifiedAt,
      },
    });
  }

  async updateStatus(domainId: string, status: DomainStatus) {
    return await prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        status: status.toUpperCase() as DomainStatus,
      },
    });
  }

  async deleteDomain(domainId: string) {
    return await prisma.domain.delete({
      where: {
        id: domainId,
      },
    });
  }
}
