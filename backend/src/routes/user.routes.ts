import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, email: true, username: true, displayName: true,
      walletAddress: true, bio: true, avatarUrl: true,
      isPublic: true, isVerified: true, twoFactorEnabled: true,
      role: true, reputation: true, createdAt: true, lastLoginAt: true,
      _count: { select: { proposals: true, votes: true } },
    },
  });
  res.json(user);
});

router.get('/:username', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      username: true, displayName: true, walletAddress: true,
      bio: true, avatarUrl: true, isPublic: true,
      role: true, reputation: true, createdAt: true,
      _count: { select: { proposals: true, votes: true } },
      proposals: {
        where: { status: { not: 'DRAFT' } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, summary: true, category: true,
          territory: true, status: true, blockHash: true, createdAt: true,
          _count: { select: { votes: true, comments: true } },
        },
      },
    },
  });

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (!user.isPublic) {
    return res.json({
      username: null,
      displayName: null,
      walletAddress: user.walletAddress,
      bio: null,
      avatarUrl: null,
      isPublic: false,
      role: user.role,
      reputation: user.reputation,
      createdAt: user.createdAt,
      _count: user._count,
      proposals: user.proposals,
    });
  }

  res.json(user);
});

router.get('/me/favorites', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        proposal: {
          include: {
            author: { select: { username: true, displayName: true, isPublic: true } },
            _count: { select: { votes: true, comments: true } },
          },
        },
      },
    });
    res.json(favorites.map(f => f.proposal));
  } catch (err) { next(err); }
});

router.patch('/me', authenticate, [
  body('displayName').optional().trim().isLength({ max: 50 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('isPublic').optional().isBoolean(),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const { displayName, bio, isPublic } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { displayName, bio, isPublic },
      select: { username: true, displayName: true, bio: true, isPublic: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
