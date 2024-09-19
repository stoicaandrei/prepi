-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subjectCategoryId" TEXT NOT NULL DEFAULT 'cm1972k460001qqry9btan7fa';

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subjectCategoryId_fkey" FOREIGN KEY ("subjectCategoryId") REFERENCES "SubjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
