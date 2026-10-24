import { Router } from 'express';
import { body, param } from 'express-validator';
import pool, { withTransaction } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { awardForStatus } from '../rewards.js';

const router = Router();
router.use(authenticate);

router.post('/', [
  body('shelterId').isInt({ min: 1 }),
  body('itemId').isInt({ min: 1 }),
  body('pickupTime').isISO8601(),
  body('notes').optional({ values: 'null' }).isString().isLength({ max: 1000 }),
  validate,
], async (req, res, next) => {
  try {
    const donation = await withTransaction(async (connection) => {
      const [shelters] = await connection.execute(
        'SELECT id FROM shelters WHERE id = ?',
        [req.body.shelterId],
      );
      if (!shelters[0]) {
        const error = new Error('Shelter not found');
        error.statusCode = 404;
        throw error;
      }
      const [items] = await connection.execute(
        `SELECT id, weight_kg, quantity, unit, status FROM inventory_items
         WHERE id = ? AND user_id = ? FOR UPDATE`,
        [req.body.itemId, req.user.id],
      );
      const item = items[0];
      if (!item) {
        const error = new Error('Inventory item not found');
        error.statusCode = 404;
        throw error;
      }
      if (item.status !== 'active') {
        const error = new Error('Only active items can be donated');
        error.statusCode = 409;
        throw error;
      }
      const weightKg = Number(item.weight_kg || (
        item.unit === 'g' ? Number(item.quantity) / 1000 : Number(item.quantity) * 0.5
      ));
      const pickupTime = new Date(req.body.pickupTime).toISOString().slice(0, 19).replace('T', ' ');
      const [result] = await connection.execute(
        `INSERT INTO donations (user_id, shelter_id, item_id, pickup_time, status, notes)
         VALUES (?, ?, ?, ?, 'scheduled', ?)`,
        [req.user.id, req.body.shelterId, item.id, pickupTime, req.body.notes || null],
      );
      await connection.execute(
        "UPDATE inventory_items SET status = 'donated' WHERE id = ?",
        [item.id],
      );
      await awardForStatus(connection, req.user.id, 'donated', item.id, weightKg);
      await connection.execute(
        `INSERT INTO notifications (user_id, type, message)
         VALUES (?, 'donation', 'Your donation has been scheduled.')`,
        [req.user.id],
      );
      const [rows] = await connection.execute(
        `SELECT d.id, d.item_id AS itemId, d.shelter_id AS shelterId, d.pickup_time AS pickupTime,
          d.status, d.accepted_at AS acceptedAt, d.verified_weight_kg AS verifiedWeightKg,
          d.notes, s.name AS shelterName, i.name AS itemName,
          COALESCE(d.verified_weight_kg, i.weight_kg) AS weightKg
         FROM donations d JOIN shelters s ON s.id = d.shelter_id
         JOIN inventory_items i ON i.id = d.item_id WHERE d.id = ?`,
        [result.insertId],
      );
      return rows[0];
    });
    return res.status(201).json({ donation });
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const [donations] = await pool.execute(
      `SELECT d.id, d.user_id AS userId, u.name AS donorName, d.shelter_id AS shelterId,
        s.name AS shelterName, d.item_id AS itemId, i.name AS itemName,
        COALESCE(d.verified_weight_kg, i.weight_kg) AS weightKg,
        d.pickup_time AS pickupTime, d.status, d.accepted_at AS acceptedAt,
        d.verified_weight_kg AS verifiedWeightKg, d.notes, d.created_at AS createdAt
       FROM donations d JOIN users u ON u.id = d.user_id
       JOIN shelters s ON s.id = d.shelter_id JOIN inventory_items i ON i.id = d.item_id
       WHERE d.user_id = ? ORDER BY d.created_at DESC`,
      [req.user.id],
    );
    return res.json({ donations });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', [
  param('id').isInt({ min: 1 }),
  body('status').isIn(['scheduled', 'completed', 'cancelled']),
  body('verifiedWeightKg').optional({ values: 'null' }).isFloat({ min: 0 }),
  validate,
], async (req, res, next) => {
  try {
    const status = req.body.status;
    const result = await withTransaction(async (connection) => {
      const [donations] = await connection.execute(
        'SELECT id, user_id, item_id, status FROM donations WHERE id = ? FOR UPDATE',
        [req.params.id],
      );
      const donation = donations[0];
      if (!donation) {
        const error = new Error('Donation not found');
        error.statusCode = 404;
        throw error;
      }
      const mayAccept = status === 'scheduled' && req.user.role === 'ngo';
      const mayComplete = status === 'completed' && req.user.role === 'ngo';
      const mayCancel = status === 'cancelled' && Number(donation.user_id) === Number(req.user.id);
      if (!mayAccept && !mayComplete && !mayCancel) {
        const error = new Error('Only an NGO can accept or complete a donation; only its donor can cancel it');
        error.statusCode = 403;
        throw error;
      }
      if (mayAccept) {
        if (donation.status !== 'scheduled') {
          const error = new Error('Only scheduled donations can be accepted');
          error.statusCode = 409;
          throw error;
        }
        await connection.execute(
          'UPDATE donations SET accepted_at = COALESCE(accepted_at, NOW()) WHERE id = ?',
          [donation.id],
        );
      }
      if (!mayAccept && donation.status !== 'scheduled') {
        const error = new Error('Only scheduled donations can be updated');
        error.statusCode = 409;
        throw error;
      }
      if (!mayAccept) {
        await connection.execute(
          'UPDATE donations SET status = ?, verified_weight_kg = COALESCE(?, verified_weight_kg) WHERE id = ?',
          [status, req.body.verifiedWeightKg ?? null, donation.id],
        );
      }
      if (status === 'cancelled') {
        await connection.execute(
          "UPDATE inventory_items SET status = 'active' WHERE id = ? AND user_id = ? AND status = 'donated'",
          [donation.item_id, donation.user_id],
        );
        await connection.execute(
          'DELETE FROM activity_log WHERE user_id = ? AND item_id = ? AND action = ? ORDER BY id DESC LIMIT 1',
          [donation.user_id, donation.item_id, 'donated'],
        );
        await connection.execute(
          'UPDATE users SET eco_score = GREATEST(0, eco_score - 25) WHERE id = ?',
          [donation.user_id],
        );
      }
      const [rows] = await connection.execute(
        `SELECT id, user_id AS userId, shelter_id AS shelterId, item_id AS itemId,
          pickup_time AS pickupTime, status, accepted_at AS acceptedAt,
          verified_weight_kg AS verifiedWeightKg, notes FROM donations WHERE id = ?`,
        [donation.id],
      );
      return rows[0];
    });
    return res.json({ donation: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/incoming', requireRole('ngo'), async (req, res, next) => {
  try {
    const [donations] = await pool.execute(
      `SELECT d.id, u.name AS donorName, s.name AS shelterName, i.name AS itemName,
        i.quantity, i.unit, COALESCE(d.verified_weight_kg, i.weight_kg) AS weightKg,
        d.pickup_time AS pickupTime, d.status, d.accepted_at AS acceptedAt,
        d.verified_weight_kg AS verifiedWeightKg, d.notes
       FROM donations d JOIN users u ON u.id = d.user_id
       JOIN shelters s ON s.id = d.shelter_id JOIN inventory_items i ON i.id = d.item_id
       WHERE d.status IN ('scheduled', 'completed') ORDER BY d.pickup_time ASC`,
    );
    return res.json({ donations });
  } catch (error) {
    return next(error);
  }
});

export default router;
