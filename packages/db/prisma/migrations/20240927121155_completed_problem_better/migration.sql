/*
  Warnings:

  - You are about to drop the `_ProblemToUserSubjectProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProblemToUserSubjectProgress" DROP CONSTRAINT "_ProblemToUserSubjectProgress_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProblemToUserSubjectProgress" DROP CONSTRAINT "_ProblemToUserSubjectProgress_B_fkey";

-- DropTable
DROP TABLE "_ProblemToUserSubjectProgress";

-- CreateTable
CREATE TABLE "CompletedProblem" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "userSubjectProgressId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompletedProblem_userSubjectProgressId_problemId_key" ON "CompletedProblem"("userSubjectProgressId", "problemId");

-- AddForeignKey
ALTER TABLE "CompletedProblem" ADD CONSTRAINT "CompletedProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedProblem" ADD CONSTRAINT "CompletedProblem_userSubjectProgressId_fkey" FOREIGN KEY ("userSubjectProgressId") REFERENCES "UserSubjectProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
