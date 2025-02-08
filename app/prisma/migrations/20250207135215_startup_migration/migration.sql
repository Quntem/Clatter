/*
  Warnings:

  - You are about to drop the `pagedocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "message" ADD COLUMN     "parentmessageid" TEXT,
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "pagedocument";

-- CreateTable
CREATE TABLE "tab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clatter.channeltype.message',
    "parentid" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "parentworkspace" TEXT NOT NULL,
    "parentchannel" TEXT,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clatter.documenttype.page',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "allowedusers" TEXT[],
    "public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tab" ADD CONSTRAINT "tab_parentid_fkey" FOREIGN KEY ("parentid") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_parentmessageid_fkey" FOREIGN KEY ("parentmessageid") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_parentchannel_fkey" FOREIGN KEY ("parentchannel") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
