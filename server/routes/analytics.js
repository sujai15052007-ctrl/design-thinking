import { Router } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/history', async (req, res, next) => {
  try {
    const [history] = await pool.execute(
      `SELECT a.action, i.name AS itemName, a.weight_kg AS weightKg,
        a.created_at AS createdAt
       FROM activity_log a LEFT JOIN inventory_items i ON i.id = a.item_id
       WHERE a.user_id = ? ORDER BY a.created_at DESC`,
      [req.user.id],
    );
    return res.json({ history });
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const [monthly] = await pool.execute(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(CASE WHEN action = 'discarded' THEN weight_kg ELSE 0 END) AS discardedKg,
        SUM(CASE WHEN action IN ('consumed', 'donated', 'used_in_recipe') THEN weight_kg ELSE 0 END) AS divertedKg
       FROM activity_log WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month`,
      [req.user.id],
    );
    const [categories] = await pool.execute(
      `SELECT i.category, SUM(a.weight_kg) AS weightKg
       FROM activity_log a JOIN inventory_items i ON i.id = a.item_id
       WHERE a.user_id = ? AND a.action IN ('consumed', 'donated', 'used_in_recipe')
       GROUP BY i.category ORDER BY weightKg DESC`,
      [req.user.id],
    );
    const [totals] = await pool.execute(
      `SELECT
        COALESCE(SUM(CASE WHEN action IN ('consumed', 'donated', 'used_in_recipe') THEN weight_kg ELSE 0 END), 0) AS divertedKg,
        COALESCE(SUM(CASE WHEN action = 'discarded' THEN weight_kg ELSE 0 END), 0) AS discardedKg
       FROM activity_log WHERE user_id = ?`,
      [req.user.id],
    );
    const [calendar] = await pool.execute(
      `SELECT DATE(created_at) AS date, COUNT(*) AS activityCount
       FROM activity_log WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 89 DAY)
       GROUP BY DATE(created_at) ORDER BY date`,
      [req.user.id],
    );
    const [destinations] = await pool.execute(
      `SELECT action, SUM(weight_kg) AS weightKg
       FROM activity_log WHERE user_id = ?
       GROUP BY action ORDER BY weightKg DESC`,
      [req.user.id],
    );
    const divertedKg = Number(totals[0].divertedKg);
    return res.json({
      monthly: monthly.map((row) => ({
        ...row,
        divertedKg: Number(row.divertedKg),
        discardedKg: Number(row.discardedKg),
      })),
      categories: categories.map((row) => ({ ...row, weightKg: Number(row.weightKg) })),
      destinations: destinations.map((row) => ({ ...row, weightKg: Number(row.weightKg) })),
      streakCalendar: calendar.map((row) => ({ date: row.date, activityCount: Number(row.activityCount) })),
      totals: {
        divertedKg,
        discardedKg: Number(totals[0].discardedKg),
        co2SavedKg: divertedKg * 2.5,
        moneySaved: divertedKg * 3.5,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
