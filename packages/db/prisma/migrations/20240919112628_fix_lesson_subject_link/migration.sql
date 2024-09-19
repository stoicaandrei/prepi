/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_lessonId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "lessonId";

-- CreateTable
CREATE TABLE "_LessonToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToSubject_AB_unique" ON "_LessonToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToSubject_B_index" ON "_LessonToSubject"("B");

-- AddForeignKey
ALTER TABLE "_LessonToSubject" ADD CONSTRAINT "_LessonToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToSubject" ADD CONSTRAINT "_LessonToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
