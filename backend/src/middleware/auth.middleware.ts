import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth/authService';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = AuthService.verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export async function requiresVerified(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { isVerified: true },
  });

  if (!user?.isVerified) {
    return res.status(403).json({ error: 'Debes verificar tu email antes de realizar esta acción' });
  }

  next();
}

export async function requiresAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }

  next();
}

export async function requiresMod(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
    return res.status(403).json({ error: 'Acceso restringido a moderadores' });
  }

  next();
}
