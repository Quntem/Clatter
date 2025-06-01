-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "extradata" JSONB,
ADD COLUMN     "members" TEXT[],
ADD COLUMN     "owner" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true;
