import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string().default('noreply@democraciadirecta.es'),
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  GENESIS_BLOCK_HASH: z.string().default('0000000000000000000000000000000000000000000000000000000000000000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
