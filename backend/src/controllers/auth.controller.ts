import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { AuthService } from '../services/auth/authService';
import { AuthRequest } from '../middleware/auth.middleware';
import { isDisposableEmail } from '../utils/disposableEmails';

// Rate limit estricto para login — 5 intentos por 15 min por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de acceso, espera 15 minutos.' },
  skipSuccessfulRequests: true,
});

// Rate limit para registro — 3 cuentas por hora por IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Demasiados registros desde esta IP.' },
});

export const registerValidation = [
  body('email')
    .isEmail().normalizeEmail()
    .custom((value) => {
      if (isDisposableEmail(value)) throw new Error('No se permiten emails temporales o desechables');
      return true;
    }),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Solo letras, números y guión bajo'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Mínimo 8 chars, mayúscula, minúscula, número y símbolo'),
  body('displayName').optional().trim().isLength({ max: 50 }),
];

export const loginValidation = [
  body('emailOrUsername').notEmpty().trim(),
  body('password').notEmpty(),
];

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, username, password, displayName, isPublic } = req.body;
    const user = await AuthService.register(email, username, password, displayName, isPublic ?? true);
    res.status(201).json({
      message: 'Cuenta creada. Revisa tu email para verificarla.',
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailOrUsername, password } = req.body;
    const ip = req.ip || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    const result = await AuthService.login(emailOrUsername, password, ip, deviceInfo);

    if ('requiresTwoFactor' in result) {
      return res.json({ requiresTwoFactor: true, userId: result.userId });
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function verifyTwoFactor(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, token } = req.body;
    const ip = req.ip || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    const result = await AuthService.verifyTwoFactor(userId, token, ip, deviceInfo);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function setup2FA(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.setupTwoFactor(req.userId!);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function enable2FA(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await AuthService.enableTwoFactor(req.userId!, req.body.token);
    res.json({ message: 'Doble factor activado correctamente' });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    await AuthService.verifyEmail(req.params.token);
    res.json({ message: 'Email verificado correctamente' });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) await AuthService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.json({ message: 'Sesión cerrada' });
}
