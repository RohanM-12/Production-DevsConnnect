/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,postId]` on the table `ContributionRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContributionRequests_requesterId_postId_key" ON "ContributionRequests"("requesterId", "postId");
