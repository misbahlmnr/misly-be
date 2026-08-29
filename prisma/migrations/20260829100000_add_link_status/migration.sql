-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('ACTIVE', 'HIDDEN');

-- AlterTable
ALTER TABLE "links" ADD COLUMN "status" "LinkStatus" NOT NULL DEFAULT 'ACTIVE';
