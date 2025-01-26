-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clatter.channeltype.message',

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "messagetype" TEXT NOT NULL,
    "parenttype" TEXT NOT NULL,
    "parentid" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
