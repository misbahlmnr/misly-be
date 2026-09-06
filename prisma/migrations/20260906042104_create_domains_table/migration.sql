/*
  Warnings:

  - You are about to drop the column `isVerified` on the `domains` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "DnsRecordType" AS ENUM ('CNAME', 'A');

-- AlterTable
ALTER TABLE "domains" DROP COLUMN "isVerified",
ADD COLUMN     "dnsRecordType" "DnsRecordType" NOT NULL DEFAULT 'CNAME',
ADD COLUMN     "dnsTarget" TEXT,
ADD COLUMN     "status" "DomainStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
