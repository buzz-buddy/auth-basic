-- AlterEnum
ALTER TYPE "PersonaFieldType" ADD VALUE 'font_select';

-- CreateTable
CREATE TABLE "Font" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "suitableForDisplay" BOOLEAN NOT NULL DEFAULT true,
    "suitableForBody" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Font_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Font_slug_key" ON "Font"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Font_family_key" ON "Font"("family");

-- CreateIndex
CREATE INDEX "Font_isActive_sortOrder_idx" ON "Font"("isActive", "sortOrder");
