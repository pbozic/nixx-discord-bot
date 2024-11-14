/*
  Warnings:

  - You are about to drop the column `username` on the `UserSelection` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserSelection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSelection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "details" TEXT,
    "reason" TEXT,
    "lootItemId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "UserSelection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSelection_lootItemId_fkey" FOREIGN KEY ("lootItemId") REFERENCES "LootItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSelection_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserSelection" ("details", "id", "lootItemId", "optionId", "reason") SELECT "details", "id", "lootItemId", "optionId", "reason" FROM "UserSelection";
DROP TABLE "UserSelection";
ALTER TABLE "new_UserSelection" RENAME TO "UserSelection";
CREATE INDEX "UserSelection_userId_lootItemId_optionId_idx" ON "UserSelection"("userId", "lootItemId", "optionId");
CREATE UNIQUE INDEX "UserSelection_lootItemId_optionId_key" ON "UserSelection"("lootItemId", "optionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
