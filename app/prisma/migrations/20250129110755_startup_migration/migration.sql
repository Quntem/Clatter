/*
  Warnings:

  - Added the required column `sender` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sender" TEXT NOT NULL,
ALTER COLUMN "messagetype" SET DEFAULT '',
ALTER COLUMN "parenttype" SET DEFAULT 'text',
ALTER COLUMN "parentid" SET DEFAULT '';

-- CreateTable
CREATE TABLE "pagedocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "parentworkspace" TEXT NOT NULL,
    "parentchannel" TEXT,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,

    CONSTRAINT "pagedocument_pkey" PRIMARY KEY ("id")
);
