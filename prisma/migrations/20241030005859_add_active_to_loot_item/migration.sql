-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LootItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "guild" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_LootItem" ("guild", "id", "name", "timestamp", "user") SELECT "guild", "id", "name", "timestamp", "user" FROM "LootItem";
DROP TABLE "LootItem";
ALTER TABLE "new_LootItem" RENAME TO "LootItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
