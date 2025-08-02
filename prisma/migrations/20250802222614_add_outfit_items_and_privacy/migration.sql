/*
  Warnings:

  - A unique constraint covering the columns `[shareSlug]` on the table `Outfit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ItemCategory" AS ENUM ('HEADWEAR', 'UPPERWEAR', 'LOWERWEAR', 'FOOTWEAR', 'ACCESSORIES', 'SOCKS', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Outfit" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareSlug" TEXT;

-- CreateTable
CREATE TABLE "public"."OutfitItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."ItemCategory" NOT NULL,
    "description" TEXT,
    "purchaseUrl" TEXT,
    "outfitId" INTEGER NOT NULL,

    CONSTRAINT "OutfitItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Outfit_shareSlug_key" ON "public"."Outfit"("shareSlug");

-- AddForeignKey
ALTER TABLE "public"."OutfitItem" ADD CONSTRAINT "OutfitItem_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
