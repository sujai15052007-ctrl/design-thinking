import { Router } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', authenticate, async (req, res, next) => {
  try {
    const [leaderboard] = await pool.execute(
      `SELECT id, name, role, eco_score AS ecoScore, streak
       FROM users ORDER BY eco_score DESC LIMIT 50`,
    );
    return res.json({ leaderboard });
  } catch (error) {
    return next(error);
  }
});

export default router;
