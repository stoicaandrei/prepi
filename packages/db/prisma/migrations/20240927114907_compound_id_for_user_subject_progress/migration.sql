/*
  Warnings:

  - A unique constraint covering the columns `[userId,subjectId]` on the table `UserSubjectProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubjectProgress_userId_subjectId_key" ON "UserSubjectProgress"("userId", "subjectId");
