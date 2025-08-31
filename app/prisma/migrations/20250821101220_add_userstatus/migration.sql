-- CreateTable
CREATE TABLE "userstatus" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "status" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastseen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userstatus_pkey" PRIMARY KEY ("id")
);
