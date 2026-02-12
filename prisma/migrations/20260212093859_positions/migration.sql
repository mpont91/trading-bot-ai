-- CreateEnum
CREATE TYPE "PositionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "status" "PositionStatus" NOT NULL,
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyOrderId" INTEGER NOT NULL,
    "exitPrice" DECIMAL(65,30),
    "exitTime" TIMESTAMP(3),
    "sellOrderId" INTEGER,
    "pnl" DECIMAL(65,30),
    "pnlPercent" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_buyOrderId_key" ON "Position"("buyOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_sellOrderId_key" ON "Position"("sellOrderId");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_buyOrderId_fkey" FOREIGN KEY ("buyOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_sellOrderId_fkey" FOREIGN KEY ("sellOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
