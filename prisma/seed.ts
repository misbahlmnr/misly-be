import { DnsRecordType, DomainStatus } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("start seeding");

  // seed default user
  const defaultUser = await prisma.user.upsert({
    where: { email: "misbah@gmail.com" },
    update: {},
    create: {
      email: "misbah@gmail.com",
      password: await bcrypt.hash("password", 10),
    },
  });

  // seed default domain
  const defaultDomain = await prisma.domain.upsert({
    where: { domainName: "misly.link" },
    update: {},
    create: {
      domainName: "misly.link",
      userId: defaultUser.id,
      status: DomainStatus.VERIFIED, // Pastikan enum ini ada di schema
      dnsRecordType: DnsRecordType.CNAME, // Pastikan enum ini ada di schema
      dnsTarget: "cname.misly.link",
      verifiedAt: new Date(),
    },
  });

  console.log(`System User: ${defaultUser.email}`);
  console.log(
    `Master Domain: ${defaultDomain.domainName} (ID: ${defaultDomain.id})`,
  );
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
