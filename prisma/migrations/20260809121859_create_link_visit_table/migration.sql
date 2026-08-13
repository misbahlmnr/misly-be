-- CreateTable
CREATE TABLE "link_visits" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "link_visits_linkId_idx" ON "link_visits"("linkId");

-- CreateIndex
CREATE INDEX "link_visits_linkId_visitedAt_idx" ON "link_visits"("linkId", "visitedAt");

-- AddForeignKey
ALTER TABLE "link_visits" ADD CONSTRAINT "link_visits_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
