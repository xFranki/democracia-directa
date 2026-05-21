import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  register, login, logout, verifyEmail,
  verifyTwoFactor, setup2FA, enable2FA,
  registerValidation, loginValidation,
  loginLimiter, registerLimiter,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerLimiter, registerValidation, validate, register);
router.post('/login', loginLimiter, loginValidation, validate, login);
router.post('/logout', logout);
router.post('/2fa/verify', verifyTwoFactor);
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/enable', authenticate, enable2FA);
router.get('/verify-email/:token', verifyEmail);

export default router;
