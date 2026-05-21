import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requiresVerified, AuthRequest } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { BlockchainService } from '../services/blockchain/blockchainService';

const router = Router();
const prisma = new PrismaClient();

router.post('/:proposalId', authenticate, requiresVerified, [
  body('choice').isIn(['YES', 'NO', 'ABSTAIN']),
  body('isAnonymous').optional().isBoolean(),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const { proposalId } = req.params;
    const { choice, isAnonymous = false } = req.body;

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal || proposal.status !== 'VOTING') {
      return res.status(400).json({ error: 'Esta propuesta no está en fase de votación' });
    }

    const existing = await prisma.vote.findUnique({
      where: { userId_proposalId: { userId: req.userId!, proposalId } },
    });
    if (existing) throw new Error('ALREADY_VOTED');

    const timestamp = new Date().toISOString();
    const voteHash = BlockchainService.generateVoteHash(req.userId!, proposalId, choice, timestamp);

    const blockHash = await BlockchainService.addBlock({
      type: 'VOTE',
      payload: { voteHash, proposalId, choice, isAnonymous, timestamp },
      timestamp,
    });

    const vote = await prisma.vote.create({
      data: {
        userId: req.userId!,
        proposalId,
        choice,
        isAnonymous,
        voteHash,
        blockHash,
      },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: { reputation: { increment: 1 } },
    });

    res.status(201).json({
      message: 'Voto registrado en la blockchain',
      voteHash: vote.voteHash,
      blockHash: vote.blockHash,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
