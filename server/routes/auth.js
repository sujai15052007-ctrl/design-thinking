import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import pool from '../db.js';
import { createToken, publicUser } from '../auth.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 120 }),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 8, max: 128 }),
    body('role').optional().isIn(['home', 'business', 'ngo']),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { name, email, password, role = 'home' } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role],
      );
      const [users] = await pool.execute(
        'SELECT id, name, email, role, units, dark_mode, eco_score, streak, location, bio, preferences, created_at FROM users WHERE id = ?',
        [result.insertId],
      );
      const user = users[0];
      return res.status(201).json({ token: createToken(user), user: publicUser(user) });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.statusCode = 409;
        error.message = 'An account with this email already exists';
      }
      return next(error);
    }
  },
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isString().notEmpty(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const [users] = await pool.execute(
        `SELECT id, name, email, role, password_hash, units, dark_mode,
          eco_score, streak, location, bio, preferences, created_at
         FROM users WHERE email = ?`,
        [req.body.email],
      );
      const user = users[0];
      if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
        return res.status(401).json({ error: 'Email or password is incorrect' });
      }
      return res.json({ token: createToken(user), user: publicUser(user) });
    } catch (error) {
      return next(error);
    }
  },
);

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, units, dark_mode, eco_score, streak, location, bio, preferences, created_at FROM users WHERE id = ?',
      [req.user.id],
    );
    if (!users[0]) return res.status(401).json({ error: 'Account no longer exists' });
    return res.json({ user: publicUser(users[0]) });
  } catch (error) {
    return next(error);
  }
});

export default router;
