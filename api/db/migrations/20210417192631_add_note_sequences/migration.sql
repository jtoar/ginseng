-- CreateTable
CREATE TABLE "_NoteSequences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_NoteSequences_AB_unique" ON "_NoteSequences"("A", "B");

-- CreateIndex
CREATE INDEX "_NoteSequences_B_index" ON "_NoteSequences"("B");
