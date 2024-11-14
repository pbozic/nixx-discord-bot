/*
  Warnings:

  - You are about to drop the column `channel` on the `LootItem` table. All the data in the column will be lost.
  - Added the required column `name` to the `LootItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LootItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "guild" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LootItem" ("guild", "id", "timestamp", "user") SELECT "guild", "id", "timestamp", "user" FROM "LootItem";
DROP TABLE "LootItem";
ALTER TABLE "new_LootItem" RENAME TO "LootItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
