-- CreateEnum
CREATE TYPE "AdviceAction" AS ENUM ('BUY', 'SELL', 'HOLD');

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeFrame" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "action" "AdviceAction" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evaluation_symbol_createdAt_idx" ON "Evaluation"("symbol", "createdAt");
