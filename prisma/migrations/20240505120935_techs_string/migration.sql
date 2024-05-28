-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "technologiesUsed" SET NOT NULL,
ALTER COLUMN "technologiesUsed" DROP DEFAULT,
ALTER COLUMN "technologiesUsed" SET DATA TYPE TEXT;
