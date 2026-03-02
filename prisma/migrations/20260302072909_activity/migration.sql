-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('INFO', 'SUCCESS', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "ActivityLevel" NOT NULL,
    "context" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
