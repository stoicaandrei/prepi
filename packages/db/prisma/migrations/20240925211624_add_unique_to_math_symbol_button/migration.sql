/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `MathSymbolButton` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MathSymbolButton_symbol_key" ON "MathSymbolButton"("symbol");
