import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { BlockchainService } from './services/blockchain/blockchainService';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import proposalRoutes from './routes/proposal.routes';
import voteRoutes from './routes/vote.routes';
import blockchainRoutes from './routes/blockchain.routes';
import commentRoutes from './routes/comment.routes';
import adminRoutes from './routes/admin.routes';
import moderacionRoutes from './routes/moderacion.routes';

const app = express();

// Seguridad: headers HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// CORS configurado estrictamente
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/proposals', proposalRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/blockchain', blockchainRoutes);
app.use('/api/v1/proposals/:proposalId/comments', commentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/moderacion', moderacionRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await BlockchainService.initGenesis();
  logger.info(`Servidor arrancado en puerto ${config.PORT}`);
});

export default app;
