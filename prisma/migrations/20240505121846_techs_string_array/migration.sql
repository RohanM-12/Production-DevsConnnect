/*
  Warnings:

  - The `technologiesUsed` column on the `Posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "technologiesUsed",
ADD COLUMN     "technologiesUsed" TEXT[];
