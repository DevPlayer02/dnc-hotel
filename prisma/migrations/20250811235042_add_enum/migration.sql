/*
  Warnings:

  - You are about to drop the column `approved` on the `reservations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'APROVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "approved",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
