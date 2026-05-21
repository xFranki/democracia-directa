-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "proposal_reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proposal_reactions_userId_proposalId_key" ON "proposal_reactions"("userId", "proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_proposalId_key" ON "favorites"("userId", "proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reactions_userId_commentId_key" ON "comment_reactions"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "proposal_reactions" ADD CONSTRAINT "proposal_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_reactions" ADD CONSTRAINT "proposal_reactions_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
