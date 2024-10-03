-- CreateEnum
CREATE TYPE "ExamDifficulty" AS ENUM ('M1', 'M2', 'M3');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('SIMULARE', 'MODEL', 'SUBIECT', 'SUBIECT_OFICIAL');

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "difficulty" "ExamDifficulty" NOT NULL,
    "type" "ExamType" NOT NULL,
    "year" INTEGER,
    "month" TEXT,
    "variantNumber" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamProblem" (
    "id" TEXT NOT NULL,
    "exam1Id" TEXT,
    "exam2Id" TEXT,
    "exam3Id" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "explanation" TEXT,
    "subAId" TEXT,
    "subBId" TEXT,
    "subCId" TEXT,

    CONSTRAINT "ExamProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSubproblem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "ExamSubproblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProblem_subAId_key" ON "ExamProblem"("subAId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProblem_subBId_key" ON "ExamProblem"("subBId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProblem_subCId_key" ON "ExamProblem"("subCId");

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_exam1Id_fkey" FOREIGN KEY ("exam1Id") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_exam2Id_fkey" FOREIGN KEY ("exam2Id") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_exam3Id_fkey" FOREIGN KEY ("exam3Id") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_subAId_fkey" FOREIGN KEY ("subAId") REFERENCES "ExamSubproblem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_subBId_fkey" FOREIGN KEY ("subBId") REFERENCES "ExamSubproblem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProblem" ADD CONSTRAINT "ExamProblem_subCId_fkey" FOREIGN KEY ("subCId") REFERENCES "ExamSubproblem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
