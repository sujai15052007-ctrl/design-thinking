import { Router } from 'express';
import { body } from 'express-validator';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const [notifications] = await pool.execute(
      `SELECT id, type, message, is_read AS isRead, created_at AS createdAt
       FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`,
      [req.user.id],
    );
    return res.json({ notifications });
  } catch (error) {
    return next(error);
  }
});

router.post('/read', [
  body('notificationIds').optional().isArray({ max: 100 }),
  body('notificationIds.*').optional().isInt({ min: 1 }),
  body('id').optional().isInt({ min: 1 }),
  validate,
], async (req, res, next) => {
  try {
    const ids = req.body.notificationIds || (req.body.id ? [req.body.id] : []);
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(', ');
      await pool.execute(
        `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND id IN (${placeholders})`,
        [req.user.id, ...ids],
      );
    } else {
      await pool.execute('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user.id]);
    }
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
