/*
  Warnings:

  - Added the required column `interestDescription` to the `ContributionRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wishesToWorkOn` to the `ContributionRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributionRequests" ADD COLUMN     "interestDescription" TEXT NOT NULL,
ADD COLUMN     "wishesToWorkOn" TEXT NOT NULL;
