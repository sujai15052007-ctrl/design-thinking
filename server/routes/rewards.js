import { Router } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT eco_score AS ecoScore, streak FROM users WHERE id = ?',
      [req.user.id],
    );
    const [badges] = await pool.execute(
      `SELECT b.id, b.name, b.description, b.icon, b.tier,
        ub.earned_at AS earnedAt, (ub.user_id IS NOT NULL) AS unlocked
       FROM badges b LEFT JOIN user_badges ub
         ON ub.badge_id = b.id AND ub.user_id = ?
       ORDER BY b.id`,
      [req.user.id],
    );
    return res.json({ ...users[0], badges });
  } catch (error) {
    return next(error);
  }
});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const [leaders] = await pool.execute(
      `SELECT id, name, role, eco_score AS ecoScore, streak
       FROM users ORDER BY eco_score DESC LIMIT 50`,
    );
    return res.json({ leaderboard: leaders });
  } catch (error) {
    return next(error);
  }
});

export default router;
