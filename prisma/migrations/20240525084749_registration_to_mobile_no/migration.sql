/*
  Warnings:

  - You are about to drop the column `registrationNo` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobileNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobileNo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_registrationNo_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "registrationNo",
ADD COLUMN     "mobileNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_key" ON "User"("mobileNo");
