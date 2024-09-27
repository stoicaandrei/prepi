/*
  Warnings:

  - You are about to drop the column `completedProblems` on the `UserSubjectProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSubjectProgress" DROP COLUMN "completedProblems";

-- CreateTable
CREATE TABLE "_ProblemToUserSubjectProgress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProblemToUserSubjectProgress_AB_unique" ON "_ProblemToUserSubjectProgress"("A", "B");

-- CreateIndex
CREATE INDEX "_ProblemToUserSubjectProgress_B_index" ON "_ProblemToUserSubjectProgress"("B");

-- AddForeignKey
ALTER TABLE "_ProblemToUserSubjectProgress" ADD CONSTRAINT "_ProblemToUserSubjectProgress_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToUserSubjectProgress" ADD CONSTRAINT "_ProblemToUserSubjectProgress_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSubjectProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
