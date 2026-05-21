-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProposalCategory" AS ENUM ('EDUCACION', 'SANIDAD', 'ECONOMIA', 'MEDIO_AMBIENTE', 'JUSTICIA', 'VIVIENDA', 'TECNOLOGIA', 'CULTURA', 'DEFENSA', 'OTRO');

-- CreateEnum
CREATE TYPE "Territory" AS ENUM ('NACIONAL', 'ANDALUCIA', 'ARAGON', 'ASTURIAS', 'BALEARES', 'CANARIAS', 'CANTABRIA', 'CASTILLA_LA_MANCHA', 'CASTILLA_Y_LEON', 'CATALUNA', 'EXTREMADURA', 'GALICIA', 'LA_RIOJA', 'MADRID', 'MURCIA', 'NAVARRA', 'PAIS_VASCO', 'VALENCIA', 'CEUTA', 'MELILLA');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'VOTING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "walletAddress" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "ProposalCategory" NOT NULL,
    "territory" "Territory" NOT NULL DEFAULT 'NACIONAL',
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "votingStartsAt" TIMESTAMP(3),
    "votingEndsAt" TIMESTAMP(3),
    "threshold" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "voteHash" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "choice" "VoteChoice" NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "nonce" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_blockHash_key" ON "proposals"("blockHash");

-- CreateIndex
CREATE UNIQUE INDEX "votes_voteHash_key" ON "votes"("voteHash");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_proposalId_key" ON "votes"("userId", "proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_hash_key" ON "blocks"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_index_key" ON "blocks"("index");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_blockHash_fkey" FOREIGN KEY ("blockHash") REFERENCES "blocks"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_blockHash_fkey" FOREIGN KEY ("blockHash") REFERENCES "blocks"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
