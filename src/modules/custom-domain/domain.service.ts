import { DomainRepository } from "./domain.repository.js";

export class DomainService {
  private domainRepository = new DomainRepository();

  async getAllDomains(userId: string) {
    const domains = await this.domainRepository.getDomainByUserId(userId);

    return domains;
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

  async deleteDomain(domainId: string) {
    const domain = await this.domainRepository.deleteDomain(domainId);
    return domain;
  }
}
