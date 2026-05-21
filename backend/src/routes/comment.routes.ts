import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requiresVerified, AuthRequest } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { rateLimit } from 'express-rate-limit';

const router = Router({ mergeParams: true });
const prisma = new PrismaClient();

const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Demasiados comentarios. Espera un momento.' },
});

const commentSelect = {
  id: true, content: true, createdAt: true, isDeleted: true, parentId: true,
  user: { select: { id: true, username: true, displayName: true, walletAddress: true, role: true } },
  _count: { select: { replies: true } },
  reactions: { select: { type: true, userId: true } },
};

// GET /proposals/:proposalId/comments
router.get('/', async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { proposalId: req.params.proposalId, parentId: null },
      orderBy: { createdAt: 'asc' },
      select: {
        ...commentSelect,
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'asc' },
          select: commentSelect,
        },
      },
    });
    res.json(comments);
  } catch (err) { next(err); }
});

// POST /proposals/:proposalId/comments
router.post('/', authenticate, requiresVerified, commentLimiter, [
  body('content').trim().isLength({ min: 2, max: 1000 }).withMessage('El comentario debe tener entre 2 y 1000 caracteres'),
  body('parentId').optional().isUUID(),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { isCommentBanned: true } });
    if (user?.isCommentBanned) return res.status(403).json({ error: 'Tu capacidad de comentar ha sido suspendida por incumplir las normas de convivencia.' });

    const { content, parentId } = req.body;

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.proposalId !== req.params.proposalId) {
        return res.status(400).json({ error: 'Comentario padre no válido' });
      }
    }

    const comment = await prisma.comment.create({
      data: { content, userId: req.userId!, proposalId: req.params.proposalId, parentId: parentId || null },
      select: {
        ...commentSelect,
        replies: { select: commentSelect },
      },
    });

    res.status(201).json(comment);
  } catch (err) { next(err); }
});

// POST /proposals/:proposalId/comments/:commentId/react
router.post('/:commentId/react', authenticate, [
  body('type').isIn(['LIKE', 'DISLIKE']),
], validate, async (req: AuthRequest, res, next) => {
  try {
    const { commentId } = req.params;
    const { type } = req.body;

    const existing = await prisma.commentReaction.findUnique({
      where: { userId_commentId: { userId: req.userId!, commentId } },
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.commentReaction.delete({ where: { id: existing.id } });
        return res.json({ action: 'removed' });
      }
      await prisma.commentReaction.update({ where: { id: existing.id }, data: { type } });
      return res.json({ action: 'changed', type });
    }

    await prisma.commentReaction.create({ data: { userId: req.userId!, commentId, type } });
    res.json({ action: 'added', type });
  } catch (err) { next(err); }
});

// DELETE /proposals/:proposalId/comments/:commentId
router.delete('/:commentId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { role: true } });
    const isMod = user?.role === 'MODERATOR' || user?.role === 'ADMIN';

    if (comment.userId !== req.userId && !isMod) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }

    await prisma.comment.update({ where: { id: req.params.commentId }, data: { isDeleted: true, content: '[Comentario eliminado]' } });
    res.json({ message: 'Comentario eliminado' });
  } catch (err) { next(err); }
});

// POST /proposals/:proposalId/comments/:commentId/ban — solo moderadores/admins
router.post('/:commentId/ban', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const moderator = await prisma.user.findUnique({ where: { id: req.userId }, select: { role: true } });
    if (moderator?.role !== 'MODERATOR' && moderator?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sin permisos' });
    }

    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId }, select: { userId: true } });
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    await prisma.$transaction([
      prisma.user.update({ where: { id: comment.userId }, data: { isCommentBanned: true } }),
      prisma.comment.update({ where: { id: req.params.commentId }, data: { isDeleted: true, content: '[Comentario eliminado por moderación]' } }),
    ]);

    res.json({ message: 'Comentarios del usuario suspendidos y comentario eliminado' });
  } catch (err) { next(err); }
});

export default router;
