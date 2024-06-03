-- AlterTable
ALTER TABLE "ContributionRequests" ADD COLUMN     "chatRoomId" INTEGER;

-- AddForeignKey
ALTER TABLE "ContributionRequests" ADD CONSTRAINT "ContributionRequests_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
