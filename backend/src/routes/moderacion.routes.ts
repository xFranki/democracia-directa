import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requiresMod } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requiresMod);

// GET /moderacion/stats — conteo de propuestas por estado
router.get('/stats', async (_req, res, next) => {
  try {
    const [pending, active, voting, approved, rejected, expired, totalComments, deletedComments] = await Promise.all([
      prisma.proposal.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.proposal.count({ where: { status: 'ACTIVE' } }),
      prisma.proposal.count({ where: { status: 'VOTING' } }),
      prisma.proposal.count({ where: { status: 'APPROVED' } }),
      prisma.proposal.count({ where: { status: 'REJECTED' } }),
      prisma.proposal.count({ where: { status: 'EXPIRED' } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { isDeleted: true } }),
    ]);
    res.json({ pending, active, voting, approved, rejected, expired, totalComments, deletedComments });
  } catch (err) { next(err); }
});

// GET /moderacion/queue — propuestas pendientes de revisión
router.get('/queue', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where: { status: 'PENDING_REVIEW' },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { username: true, displayName: true, isPublic: true } },
          _count: { select: { votes: true, comments: true } },
        },
      }),
      prisma.proposal.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

    res.json({ proposals, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

export default router;
