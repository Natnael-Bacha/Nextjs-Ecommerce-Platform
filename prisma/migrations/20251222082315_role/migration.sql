-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lowStockAt" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
