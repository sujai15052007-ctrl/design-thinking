import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import alertsRoutes from './routes/alerts.js';
import analyticsRoutes from './routes/analytics.js';
import shelterRoutes from './routes/shelters.js';
import donationRoutes from './routes/donations.js';
import marketplaceRoutes from './routes/marketplace.js';
import recipeRoutes from './routes/recipes.js';
import rewardRoutes from './routes/rewards.js';
import profileRoutes from './routes/profile.js';
import ngoRoutes from './routes/ngo.js';
import leaderboardRoutes from './routes/leaderboard.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

app.use(helmet());
app.use(cors({
  origin: allowedOrigin,
  credentials: false,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ngo', ngoRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
