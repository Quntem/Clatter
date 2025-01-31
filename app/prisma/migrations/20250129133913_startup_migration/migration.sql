/*
  Warnings:

  - Added the required column `parentworkspace` to the `channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "parentworkspace" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pagedocument" ADD COLUMN     "DateModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
