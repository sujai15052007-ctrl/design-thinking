import { Router } from 'express';
import { body } from 'express-validator';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { publicUser } from '../auth.js';
import { createToken } from '../auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, name, email, role, units, dark_mode, eco_score, streak, location, bio, preferences, created_at
       FROM users WHERE id = ?`,
      [req.user.id],
    );
    if (!users[0]) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ user: publicUser(users[0]) });
  } catch (error) {
    return next(error);
  }
});

router.put('/', [
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('units').optional().isIn(['metric', 'imperial']),
  body('darkMode').optional().isBoolean(),
  body('role').optional().isIn(['home', 'business', 'ngo']),
  body('location').optional().isString().isLength({ max: 255 }),
  body('bio').optional().isString().isLength({ max: 2000 }),
  body('preferences').optional().isObject(),
  validate,
], async (req, res, next) => {
  try {
    const fields = {
      name: 'name', units: 'units', darkMode: 'dark_mode', role: 'role',
      location: 'location', bio: 'bio', preferences: 'preferences',
    };
    const updates = [];
    const values = [];
    for (const [input, column] of Object.entries(fields)) {
      if (Object.hasOwn(req.body, input)) {
        updates.push(`${column} = ?`);
        const value = input === 'darkMode'
          ? Boolean(req.body[input])
          : input === 'preferences' ? JSON.stringify(req.body[input]) : req.body[input];
        values.push(value);
      }
    }
    if (updates.length) {
      values.push(req.user.id);
      await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [users] = await pool.execute(
      `SELECT id, name, email, role, units, dark_mode, eco_score, streak, location, bio, preferences, created_at
       FROM users WHERE id = ?`,
      [req.user.id],
    );
    return res.json({ user: publicUser(users[0]), token: createToken(users[0]) });
  } catch (error) {
    return next(error);
  }
});

export default router;
