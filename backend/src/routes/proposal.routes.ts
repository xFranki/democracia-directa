import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requiresVerified, AuthRequest } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { BlockchainService } from '../services/blockchain/blockchainService';
import { rateLimit } from 'express-rate-limit';

const router = Router();
const prisma = new PrismaClient();

const proposalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Máximo 5 propuestas por hora' },
});

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const category = req.query.category as string;
  const territory = req.query.territory as string;
  const status = req.query.status as string;
  const search = req.query.search as string;
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (territory) where.territory = territory;
  if (status) where.status = status;
  else where.status = { not: 'DRAFT' };
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { summary: { contains: search, mode: 'insensitive' } },
  ];

  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { username: true, displayName: true, walletAddress: true, isPublic: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.proposal.count({ where }),
  ]);

  res.json({ proposals, total, page, pages: Math.ceil(total / limit) });
});

router.get('/:id', async (req, res) => {
  const proposal = await prisma.proposal.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { username: true, displayName: true, walletAddress: true, isPublic: true } },
      _count: { select: { votes: true, comments: true, reactions: true, favorites: true } },
      votes: {
        select: {
          choice: true, isAnonymous: true, voteHash: true, createdAt: true,
          user: { select: { username: true, walletAddress: true } },
        },
      },
      reactions: { select: { type: true, userId: true } },
      favorites: { select: { userId: true } },
    },
  });

  if (!proposal) return res.status(404).json({ error: 'Propuesta no encontrada' });
  res.json(proposal);
});

router.post('/', authenticate, requiresVerified, proposalLimiter, [
  body('title').trim().isLength({ min: 10, max: 200 }),
  body('summary').trim().isLength({ min: 50, max: 500 }),
  body('content').trim().isLength({ min: 200 }),
  body('category').isIn([
    'EDUCACION', 'SANIDAD', 'ECONOMIA', 'MEDIO_AMBIENTE',
    'JUSTICIA', 'VIVIENDA', 'TECNOLOGIA', 'CULTURA', 'DEFENSA', 'OTRO',
  ]),
  body('territory').optional().isString(),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const { title, summary, content, category, territory } = req.body;

    const blockHash = await BlockchainService.addBlock({
      type: 'PROPOSAL',
      payload: { authorId: req.userId, title, category, territory },
      timestamp: new Date().toISOString(),
    });

    const proposal = await prisma.proposal.create({
      data: {
        title, summary, content, category,
        territory: territory || 'NACIONAL',
        authorId: req.userId!,
        blockHash,
        status: 'PENDING_REVIEW',
      },
      include: {
        author: { select: { username: true, walletAddress: true } },
      },
    });

    res.status(201).json(proposal);
  } catch (err) {
    next(err);
  }
});

// PATCH /:id/status — solo moderadores/admins
router.patch('/:id/status', authenticate, [
  body('status').isIn(['PENDING_REVIEW', 'ACTIVE', 'VOTING', 'APPROVED', 'REJECTED', 'EXPIRED']),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const mod = await prisma.user.findUnique({ where: { id: req.userId }, select: { role: true } });
    if (mod?.role !== 'MODERATOR' && mod?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sin permisos' });
    }

    const { status } = req.body;
    const data: Record<string, unknown> = { status };

    if (status === 'VOTING') data.votingStartsAt = new Date();
    if (status === 'APPROVED' || status === 'REJECTED' || status === 'EXPIRED') data.votingEndsAt = new Date();

    const proposal = await prisma.proposal.update({
      where: { id: req.params.id },
      data,
      select: { id: true, status: true },
    });

    res.json(proposal);
  } catch (err) { next(err); }
});

// POST /:id/react — like/dislike en una propuesta (toggle)
router.post('/:id/react', authenticate, [
  body('type').isIn(['LIKE', 'DISLIKE']),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const { type } = req.body;
    const proposalId = req.params.id;

    const existing = await prisma.proposalReaction.findUnique({
      where: { userId_proposalId: { userId: req.userId!, proposalId } },
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.proposalReaction.delete({ where: { id: existing.id } });
        return res.json({ action: 'removed' });
      }
      await prisma.proposalReaction.update({ where: { id: existing.id }, data: { type } });
      return res.json({ action: 'changed', type });
    }

    await prisma.proposalReaction.create({ data: { userId: req.userId!, proposalId, type } });
    res.json({ action: 'added', type });
  } catch (err) { next(err); }
});

// POST /:id/favorite — guardar/quitar de favoritos (toggle)
router.post('/:id/favorite', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const proposalId = req.params.id;

    const existing = await prisma.favorite.findUnique({
      where: { userId_proposalId: { userId: req.userId!, proposalId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ saved: false });
    }

    await prisma.favorite.create({ data: { userId: req.userId!, proposalId } });
    res.json({ saved: true });
  } catch (err) { next(err); }
});

export default router;
