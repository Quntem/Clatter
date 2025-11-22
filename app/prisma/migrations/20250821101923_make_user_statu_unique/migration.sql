/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `userstatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userstatus_user_key" ON "userstatus"("user");
