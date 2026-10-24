import { Router } from 'express';
import { body, param, query } from 'express-validator';
import pool, { withTransaction } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get('/', [
  query('dietary').optional().trim().isLength({ max: 60 }),
  query('excludeAllergens').optional().trim().isLength({ max: 500 }),
  validate,
], async (req, res, next) => {
  try {
    const clauses = ["l.status = 'open'", '(l.expires_at IS NULL OR l.expires_at > NOW())'];
    const values = [];
    if (req.query.dietary) {
      clauses.push('JSON_CONTAINS(l.dietary_tags, JSON_QUOTE(?))');
      values.push(req.query.dietary);
    }
    const excluded = req.query.excludeAllergens
      ? req.query.excludeAllergens.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];
    for (const allergen of excluded) {
      clauses.push('NOT JSON_CONTAINS(l.allergens, JSON_QUOTE(?))');
      values.push(allergen);
    }
    const [listings] = await pool.execute(
      `SELECT l.id, l.user_id AS userId, u.name AS giverName, l.title, l.description,
        l.portions, l.pickup_window AS pickupWindow, l.pickup_location AS pickupLocation,
        l.category, l.dietary_tags AS dietary, l.allergens, l.price, l.status, l.expires_at AS expiresAt,
        c.claimer_id AS claimerId, claimant.name AS claimedBy
       FROM marketplace_listings l JOIN users u ON u.id = l.user_id
       LEFT JOIN marketplace_claims c ON c.listing_id = l.id
       LEFT JOIN users claimant ON claimant.id = c.claimer_id
       WHERE ${clauses.join(' AND ')} ORDER BY l.created_at DESC`,
      values,
    );
    return res.json({ listings: listings.map((listing) => ({
      ...listing,
      dietary: typeof listing.dietary === 'string' ? JSON.parse(listing.dietary) : listing.dietary,
      allergens: typeof listing.allergens === 'string' ? JSON.parse(listing.allergens) : listing.allergens,
      claimed: listing.claimerId !== null,
    })) });
  } catch (error) {
    return next(error);
  }
});

router.post('/', [
  body('title').trim().isLength({ min: 1, max: 180 }),
  body('description').optional({ values: 'null' }).isString().isLength({ max: 2000 }),
  body('portions').optional({ values: 'null' }).isString().isLength({ max: 100 }),
  body('category').optional().trim().isLength({ max: 80 }),
  body('pickupLocation').optional({ values: 'null' }).isString().isLength({ max: 255 }),
  body('pickupWindow').optional({ values: 'null' }).isString().isLength({ max: 120 }),
  body('dietary').optional().isArray({ max: 20 }),
  body('allergens').optional().isArray({ max: 20 }),
  body('price').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('expiresAt').optional({ values: 'null' }).isISO8601(),
  validate,
], async (req, res, next) => {
  try {
    const {
      title, description = '', portions = '', category = 'Produce',
      pickupLocation = req.body.locationDistance || '',
      pickupWindow = '', dietary = [], allergens = [], price = 0, expiresAt = null,
    } = req.body;
    const normalizedExpiry = expiresAt
      ? new Date(expiresAt).toISOString().slice(0, 19).replace('T', ' ')
      : null;
    const [result] = await pool.execute(
      `INSERT INTO marketplace_listings
       (user_id, title, description, portions, category, pickup_window, pickup_location,
        dietary_tags, allergens, price, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, portions, category, pickupWindow, pickupLocation,
        JSON.stringify(dietary), JSON.stringify(allergens), price, normalizedExpiry],
    );
    return res.status(201).json({
      listing: {
        id: result.insertId, userId: req.user.id, title, description, portions,
        pickupWindow, pickupLocation, category, dietary, allergens, price, status: 'open',
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/claim', [param('id').isInt({ min: 1 }), validate], async (req, res, next) => {
  try {
    const listing = await withTransaction(async (connection) => {
      const [rows] = await connection.execute(
        `SELECT id, user_id, title, portions, pickup_location, status, expires_at
         FROM marketplace_listings WHERE id = ? FOR UPDATE`,
        [req.params.id],
      );
      const current = rows[0];
      if (!current || current.status !== 'open' || (current.expires_at && new Date(current.expires_at) <= new Date())) {
        const error = new Error('This listing is no longer available');
        error.statusCode = 409;
        throw error;
      }
      if (Number(current.user_id) === Number(req.user.id)) {
        const error = new Error('You cannot claim your own listing');
        error.statusCode = 400;
        throw error;
      }
      await connection.execute(
        'INSERT INTO marketplace_claims (listing_id, claimer_id) VALUES (?, ?)',
        [current.id, req.user.id],
      );
      await connection.execute(
        "UPDATE marketplace_listings SET status = 'claimed' WHERE id = ?",
        [current.id],
      );
      await connection.execute(
        `INSERT INTO notifications (user_id, type, message)
         VALUES (?, 'marketplace', ?)`,
        [current.user_id, `Your listing "${current.title}" has been claimed.`],
      );
      const [claimRows] = await connection.execute(
        'SELECT id, title, portions, pickup_location AS pickupLocation, status FROM marketplace_listings WHERE id = ?',
        [current.id],
      );
      return claimRows[0];
    });
    return res.json({ listing });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      error.statusCode = 409;
      error.message = 'This listing has already been claimed';
    }
    return next(error);
  }
});

router.delete('/:id', [param('id').isInt({ min: 1 }), validate], async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM marketplace_listings WHERE id = ? AND user_id = ? AND status = 'open'",
      [req.params.id, req.user.id],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Open listing not found' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
