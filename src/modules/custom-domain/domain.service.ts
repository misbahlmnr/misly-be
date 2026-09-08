import type { DomainStatus } from "@/generated/prisma/enums.js";
import { DomainRepository } from "./domain.repository.js";

export class DomainService {
  private domainRepository = new DomainRepository();

  async getAllDomains(userId: string) {
    const domains = await this.domainRepository.getDomainByUserId(userId);

    return domains;
  }

  async getDomainByName(domainName: string) {
    const domain = await this.domainRepository.getDomainByName(domainName);
    return domain;
  }

  async addDomain(
    userId: string,
    domainName: string,
    dnsTarget: string,
    dnsRecordType: string,
    status: string,
  ) {
    const domain = await this.domainRepository.addDomain(
      userId,
      domainName,
      dnsTarget,
      dnsRecordType,
      status,
      null,
    );
    return domain;
  }

  async getDomainById(domainId: string) {
    const domain = await this.domainRepository.getDomainById(domainId);
    return domain;
  }

  async updateDomain(
    domainId: string,
    domainName: string,
    dnsTarget: string,
    dnsRecordType: string,
    status: string,
  ) {
    const domain = await this.domainRepository.update(
      domainId,
      domainName,
      dnsTarget,
      dnsRecordType,
      status,
      null,
    );
    return domain;
  }

  async updateDomainStatus(domainId: string, status: DomainStatus) {
    const domain = await this.domainRepository.updateStatus(domainId, status);
    return domain;
  }

  async deleteDomain(domainId: string) {
    const domain = await this.domainRepository.deleteDomain(domainId);
    return domain;
  }
}
