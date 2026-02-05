-- CreateEnum
CREATE TYPE "Action" AS ENUM ('BUY', 'SELL', 'HOLD');

-- CreateTable
CREATE TABLE "Decision" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeFrame" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "action" "Action" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Decision_symbol_createdAt_idx" ON "Decision"("symbol", "createdAt");
