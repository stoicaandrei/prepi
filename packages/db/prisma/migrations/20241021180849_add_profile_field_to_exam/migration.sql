/*
  Warnings:

  - Added the required column `profile` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamProfile" AS ENUM ('M_mate_info', 'M_st_nat', 'M_tehnologic', 'M_pedagogic');

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "profile" "ExamProfile" NOT NULL;
