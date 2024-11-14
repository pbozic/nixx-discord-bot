-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trait" TEXT NOT NULL,
    "lootItemId" TEXT NOT NULL,
    CONSTRAINT "Option_lootItemId_fkey" FOREIGN KEY ("lootItemId") REFERENCES "LootItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LootItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guild" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "guild" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserSelection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "lootItemId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "UserSelection_lootItemId_fkey" FOREIGN KEY ("lootItemId") REFERENCES "LootItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSelection_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
