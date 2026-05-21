import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../../utils/config';
import { BlockchainService } from '../blockchain/blockchainService';
import { sendVerificationEmail } from '../email/emailService';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos

export class AuthService {
  static async register(email: string, username: string, password: string, displayName?: string, isPublic: boolean = true) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error('EMAIL_IN_USE');

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) throw new Error('USERNAME_IN_USE');

    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
    const userId = uuidv4();
    const walletAddress = BlockchainService.generateWalletAddress(userId, email);

    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        username,
        displayName: displayName || username,
        passwordHash,
        walletAddress,
        isPublic,
      },
      select: {
        id: true, email: true, username: true,
        displayName: true, walletAddress: true,
        isVerified: true, createdAt: true,
      },
    });

    const verificationToken = await this.createEmailVerification(email);
    await sendVerificationEmail(email, verificationToken);

    return user;
  }

  static async login(emailOrUsername: string, password: string, ip: string, deviceInfo: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) throw new Error('INVALID_CREDENTIALS');

    if (user.isBanned) throw new Error('ACCOUNT_BANNED');

    // Cuenta bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('ACCOUNT_LOCKED');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      const attempts = user.loginAttempts + 1;
      const lockData = attempts >= MAX_LOGIN_ATTEMPTS
        ? { lockedUntil: new Date(Date.now() + LOCK_DURATION_MS), loginAttempts: 0 }
        : { loginAttempts: attempts };

      await prisma.user.update({ where: { id: user.id }, data: lockData });
      throw new Error('INVALID_CREDENTIALS');
    }

    // Reset intentos fallidos
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    // Si tiene 2FA activo, no emitimos tokens aún
    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    return this.createTokenPair(user.id, ip, deviceInfo);
  }

  static async verifyTwoFactor(userId: string, token: string, ip: string, deviceInfo: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new Error('2FA_NOT_CONFIGURED');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new Error('INVALID_2FA_TOKEN');

    return this.createTokenPair(userId, ip, deviceInfo);
  }

  static async setupTwoFactor(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('USER_NOT_FOUND');

    const secret = speakeasy.generateSecret({
      name: `DemocraciaDirecta:${user.email}`,
      length: 32,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  }

  static async enableTwoFactor(userId: string, token: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new Error('2FA_NOT_CONFIGURED');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new Error('INVALID_2FA_TOKEN');

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
  }

  static async createTokenPair(userId: string, ip: string, deviceInfo: string) {
    const accessToken = jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        ipAddress: ip,
        deviceInfo,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  static async createEmailVerification(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await prisma.emailVerification.create({
      data: { email, token, expiresAt },
    });

    return token;
  }

  static async verifyEmail(token: string) {
    const verification = await prisma.emailVerification.findUnique({ where: { token } });

    if (!verification || verification.expiresAt < new Date() || verification.usedAt) {
      throw new Error('INVALID_OR_EXPIRED_TOKEN');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: verification.email },
        data: { isVerified: true },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  static verifyAccessToken(token: string): { userId: string } {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as { userId: string };
  }

  static async logout(refreshToken: string) {
    await prisma.session.delete({ where: { token: refreshToken } }).catch(() => {});
  }
}
