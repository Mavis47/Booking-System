/*
  Warnings:

  - You are about to drop the column `available` on the `Slot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "available",
ADD COLUMN     "bookedSeats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSeats" INTEGER NOT NULL DEFAULT 10;
