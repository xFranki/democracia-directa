import nodemailer from 'nodemailer';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';

function createTransport() {
  if (!config.SMTP_USER || !config.SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${config.FRONTEND_URL}/auth/verificar-email?token=${token}`;
  const transport = createTransport();

  if (!transport) {
    logger.info(`[DEV] Email de verificación para ${email}: ${link}`);
    return;
  }

  await transport.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: 'Verifica tu cuenta en Democracia Directa',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f1a; color: #fff; border-radius: 12px;">
        <h2 style="color: #00d68f; margin-bottom: 8px;">Democracia<span style="color: #fff">Directa</span></h2>
        <p style="color: rgba(255,255,255,0.7);">Haz clic en el botón para verificar tu cuenta. El enlace caduca en 24 horas.</p>
        <a href="${link}" style="display: inline-block; margin-top: 24px; background: #00d68f; color: #0f0f1a; font-weight: bold; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Verificar mi cuenta
        </a>
        <p style="margin-top: 24px; color: rgba(255,255,255,0.3); font-size: 12px;">
          Si no creaste esta cuenta, ignora este email.
        </p>
      </div>
    `,
  });
}
