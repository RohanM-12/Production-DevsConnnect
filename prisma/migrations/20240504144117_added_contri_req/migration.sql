-- CreateTable
CREATE TABLE "ContributionRequests" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContributionRequests" ADD CONSTRAINT "ContributionRequests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionRequests" ADD CONSTRAINT "ContributionRequests_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
