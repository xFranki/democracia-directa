import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { BlockchainService } from '../services/blockchain/blockchainService';

const router = Router();
const prisma = new PrismaClient();

router.get('/blocks', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;

  const [blocks, total] = await Promise.all([
    prisma.block.findMany({
      orderBy: { index: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.block.count(),
  ]);

  res.json({ blocks, total, page, pages: Math.ceil(total / limit) });
});

router.get('/blocks/:hash', async (req, res) => {
  const block = await prisma.block.findUnique({
    where: { hash: req.params.hash },
    include: {
      votes: { select: { voteHash: true, choice: true, isAnonymous: true, createdAt: true } },
      proposals: { select: { id: true, title: true, status: true } },
    },
  });

  if (!block) return res.status(404).json({ error: 'Bloque no encontrado' });
  res.json(block);
});

router.get('/verify', async (_req, res) => {
  const result = await BlockchainService.verifyChain();
  res.json(result);
});

router.get('/verify-vote/:hash', async (req, res) => {
  const valid = await BlockchainService.verifyVoteReceipt(req.params.hash);
  res.json({ valid, hash: req.params.hash });
});

router.get('/stats', async (_req, res) => {
  const [blocks, votes, proposals] = await Promise.all([
    prisma.block.count(),
    prisma.vote.count(),
    prisma.proposal.count(),
  ]);

  const lastBlock = await BlockchainService.getLastBlock();
  res.json({ totalBlocks: blocks, totalVotes: votes, totalProposals: proposals, lastBlock });
});

export default router;
