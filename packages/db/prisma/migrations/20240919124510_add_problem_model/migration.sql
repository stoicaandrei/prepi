-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_ANSWER', 'MULTIPLE_VARIABLES');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "type" "ProblemType" NOT NULL,
    "legacyId" TEXT,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'archive',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "problemExplanationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultipleChoiceOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "MultipleChoiceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleAnswer" (
    "id" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "SingleAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemVariable" (
    "id" TEXT NOT NULL,
    "variableName" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemHint" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemHint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemExplanation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ProblemExplanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProblemToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SingleAnswer_problemId_key" ON "SingleAnswer"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProblemToSubject_AB_unique" ON "_ProblemToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_ProblemToSubject_B_index" ON "_ProblemToSubject"("B");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_problemExplanationId_fkey" FOREIGN KEY ("problemExplanationId") REFERENCES "ProblemExplanation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleChoiceOption" ADD CONSTRAINT "MultipleChoiceOption_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleAnswer" ADD CONSTRAINT "SingleAnswer_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemVariable" ADD CONSTRAINT "ProblemVariable_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemHint" ADD CONSTRAINT "ProblemHint_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToSubject" ADD CONSTRAINT "_ProblemToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToSubject" ADD CONSTRAINT "_ProblemToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
