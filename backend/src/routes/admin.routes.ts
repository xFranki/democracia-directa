import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requiresAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requiresAdmin);

// GET /admin/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, proposals, votes, comments, bannedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.proposal.count(),
      prisma.vote.count(),
      prisma.comment.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { isBanned: true } }),
    ]);
    res.json({ users, proposals, votes, comments, bannedUsers });
  } catch (err) { next(err); }
});

// GET /admin/users
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const search = req.query.search as string;

    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { displayName: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, username: true, displayName: true, email: true,
          role: true, isVerified: true, isBanned: true, isCommentBanned: true,
          isPublic: true, reputation: true, createdAt: true,
          _count: { select: { proposals: true, votes: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH /admin/users/:id/role
router.patch('/users/:id/role', [
  body('role').isIn(['CITIZEN', 'MODERATOR', 'ADMIN']),
], validate, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, username: true, role: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PATCH /admin/users/:id/ban
router.patch('/users/:id/ban', async (req, res, next) => {
  try {
    const current = await prisma.user.findUnique({ where: { id: req.params.id }, select: { isBanned: true } });
    if (!current) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: !current.isBanned },
      select: { id: true, username: true, isBanned: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PATCH /admin/users/:id/comment-ban
router.patch('/users/:id/comment-ban', async (req, res, next) => {
  try {
    const current = await prisma.user.findUnique({ where: { id: req.params.id }, select: { isCommentBanned: true } });
    if (!current) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isCommentBanned: !current.isCommentBanned },
      select: { id: true, username: true, isCommentBanned: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
