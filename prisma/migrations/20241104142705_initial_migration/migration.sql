/*
  Warnings:

  - You are about to drop the column `identifier` on the `verificationtokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,token]` on the table `verificationtokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `verificationtokens` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `verificationtokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "verificationtokens_identifier_token_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "timeline" TEXT;

-- AlterTable
ALTER TABLE "verificationtokens" DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Towns" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "region" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "postal_code" BIGINT,
    "active_listings" BIGINT,
    "population" BIGINT,
    "is_featured" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "Towns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_email_token_key" ON "verificationtokens"("email", "token");
