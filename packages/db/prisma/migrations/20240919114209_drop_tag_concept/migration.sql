/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LessonToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToTag" DROP CONSTRAINT "_LessonToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToTag" DROP CONSTRAINT "_LessonToTag_B_fkey";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_LessonToTag";
