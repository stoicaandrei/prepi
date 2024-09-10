/*
  Warnings:

  - Added the required column `raw` to the `LessonLegacyContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LessonLegacyContent" ADD COLUMN     "raw" TEXT NOT NULL;
