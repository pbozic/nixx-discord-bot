/*
  Warnings:

  - A unique constraint covering the columns `[lootItemId,optionId]` on the table `UserSelection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "UserSelection_username_lootItemId_optionId_idx" ON "UserSelection"("username", "lootItemId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSelection_lootItemId_optionId_key" ON "UserSelection"("lootItemId", "optionId");
