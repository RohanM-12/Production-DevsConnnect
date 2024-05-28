-- DropForeignKey
ALTER TABLE "ContributionRequests" DROP CONSTRAINT "ContributionRequests_postId_fkey";

-- AddForeignKey
ALTER TABLE "ContributionRequests" ADD CONSTRAINT "ContributionRequests_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
