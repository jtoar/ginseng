-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "heading" TEXT,
    "parentEntryId" INTEGER,
    FOREIGN KEY ("parentEntryId") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("id", "createdAt", "updatedAt", "heading") SELECT "id", "createdAt", "updatedAt", "heading" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE UNIQUE INDEX "Entry.heading_unique" ON "Entry"("heading");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
