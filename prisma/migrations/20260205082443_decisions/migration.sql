-- CreateTable
CREATE TABLE "Decisions" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeFrame" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Decisions_symbol_createdAt_idx" ON "Decisions"("symbol", "createdAt");
