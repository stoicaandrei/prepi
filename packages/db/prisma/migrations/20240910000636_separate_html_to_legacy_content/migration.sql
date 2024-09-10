/*
  Warnings:

  - You are about to drop the column `html` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "html";

-- CreateTable
CREATE TABLE "LessonLegacyContent" (
    "id" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "LessonLegacyContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonLegacyContent_lessonId_key" ON "LessonLegacyContent"("lessonId");

-- AddForeignKey
ALTER TABLE "LessonLegacyContent" ADD CONSTRAINT "LessonLegacyContent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
