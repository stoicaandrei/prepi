-- CreateTable
CREATE TABLE "MathSymbolButton" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "latex" TEXT NOT NULL,

    CONSTRAINT "MathSymbolButton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MathSymbolButtonToProblem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MathSymbolButtonToProblem_AB_unique" ON "_MathSymbolButtonToProblem"("A", "B");

-- CreateIndex
CREATE INDEX "_MathSymbolButtonToProblem_B_index" ON "_MathSymbolButtonToProblem"("B");

-- AddForeignKey
ALTER TABLE "_MathSymbolButtonToProblem" ADD CONSTRAINT "_MathSymbolButtonToProblem_A_fkey" FOREIGN KEY ("A") REFERENCES "MathSymbolButton"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MathSymbolButtonToProblem" ADD CONSTRAINT "_MathSymbolButtonToProblem_B_fkey" FOREIGN KEY ("B") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
