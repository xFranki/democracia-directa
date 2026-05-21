import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(err.message, { stack: err.stack, path: req.path });

  const errorMap: Record<string, { status: number; message: string }> = {
    EMAIL_IN_USE: { status: 409, message: 'Este email ya está registrado' },
    USERNAME_IN_USE: { status: 409, message: 'Este nombre de usuario ya existe' },
    INVALID_CREDENTIALS: { status: 401, message: 'Credenciales incorrectas' },
    ACCOUNT_LOCKED: { status: 423, message: 'Cuenta bloqueada temporalmente por intentos fallidos' },
    ACCOUNT_BANNED: { status: 403, message: 'Tu cuenta ha sido suspendida por incumplir las normas de la plataforma' },
    INVALID_2FA_TOKEN: { status: 401, message: 'Código de doble factor inválido' },
    INVALID_OR_EXPIRED_TOKEN: { status: 400, message: 'Token inválido o expirado' },
    USER_NOT_FOUND: { status: 404, message: 'Usuario no encontrado' },
    UNAUTHORIZED: { status: 403, message: 'No tienes permiso para esta acción' },
    ALREADY_VOTED: { status: 409, message: 'Ya has votado en esta propuesta' },
  };

  const mapped = errorMap[err.message];
  if (mapped) {
    return res.status(mapped.status).json({ error: mapped.message });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}
