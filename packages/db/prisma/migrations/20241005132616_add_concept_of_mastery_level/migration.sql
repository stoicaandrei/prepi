-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "UserSubjectProgress" ADD COLUMN     "masteryLevel" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
