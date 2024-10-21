/*
  Warnings:

  - You are about to drop the column `exam1Id` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `exam2Id` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `exam3Id` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `subAId` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `subBId` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the column `subCId` on the `ExamProblem` table. All the data in the column will be lost.
  - You are about to drop the `ExamSubproblem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `examId` to the `ExamProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `ExamProblem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamProblemCategory" AS ENUM ('SUB1', 'SUB2', 'SUB3');

-- CreateEnum
CREATE TYPE "ExamSubproblemCategory" AS ENUM ('A', 'B', 'C');

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_exam1Id_fkey";

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_exam2Id_fkey";

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_exam3Id_fkey";

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_subAId_fkey";

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_subBId_fkey";

-- DropForeignKey
ALTER TABLE "ExamProblem" DROP CONSTRAINT "ExamProblem_subCId_fkey";

-- DropIndex
DROP INDEX "ExamProblem_subAId_key";

-- DropIndex
DROP INDEX "ExamProblem_subBId_key";

-- DropIndex
DROP INDEX "ExamProblem_subCId_key";

-- AlterTable
ALTER TABLE "ExamProblem" DROP COLUMN "exam1Id",
DROP COLUMN "exam2Id",
DROP COLUMN "exam3Id",
DROP COLUMN "explanation",
DROP COLUMN "subAId",
DROP COLUMN "subBId",
DROP COLUMN "subCId",
ADD COLUMN     "category" "ExamProblemCategory",
ADD COLUMN     "examId" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "subcategory" "ExamSubproblemCategory";

-- DropTable
DROP TABLE "ExamSubproblem";

-- CreateTable
CREATE TABLE "ExamProblemOfficialSolutionStep" (
    "id" TEXT NOT NULL,
    "examProblemId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "ExamProblemOfficialSolutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSourceFiles" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "examPdfUrl" TEXT NOT NULL,
    "examMD" TEXT NOT NULL,
    "solutionPdfUrl" TEXT NOT NULL,
    "solutionMD" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSourceFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamSourceFiles_examId_key" ON "ExamSourceFiles"("examId");

-- CreateIndex
CREATE INDEX "ExamProblem_category_subcategory_order_idx" ON "ExamProblem"("category", "subcategory", "order");

-- AddForeignKey
ALTER TABLE "ExamProblemOfficialSolutionStep" ADD CONSTRAINT "ExamProblemOfficialSolutionStep_examProblemId_fkey" FOREIGN KEY ("examProblemId") REFERENCES "ExamProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ExamProblem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSourceFiles" ADD CONSTRAINT "ExamSourceFiles_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
