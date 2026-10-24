import { Router } from 'express';
import { body, param, query } from 'express-validator';
import pool, { withTransaction } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { awardForStatus } from '../rewards.js';

const router = Router();
router.use(authenticate);

const itemSelect = `SELECT id, name, category, storage_location AS storage, quantity, unit,
  expiry_date AS expiryDate, purchase_date AS purchaseDate, barcode, status,
  weight_kg AS weightKg, estimated_value AS estimatedValue, co2_impact_kg AS co2ImpactKg,
  notes, created_at AS createdAt
  FROM inventory_items`;
const massInKg = { g: 0.001, kg: 1, oz: 0.028349523125, lb: 0.45359237 };

function normalizeQuantity(quantity, unit, weightKg) {
  const factor = massInKg[unit];
  if (!factor) return { quantity: Number(quantity), unit, weightKg: weightKg ?? null };
  const canonicalWeight = Number(weightKg ?? Number(quantity) * factor);
  return { quantity: canonicalWeight, unit: 'kg', weightKg: canonicalWeight };
}

router.get('/', [
  query('category').optional().trim().isLength({ max: 80 }),
  query('location').optional().trim().isLength({ max: 80 }),
  query('status').optional().isIn(['active', 'consumed', 'donated', 'used_in_recipe', 'discarded']),
  query('search').optional().trim().isLength({ max: 120 }),
  query('sort').optional().isIn(['expiry_asc', 'expiry_desc', 'name', 'created_desc']),
  validate,
], async (req, res, next) => {
  try {
    const { category, location, status, search, sort } = req.query;
    const clauses = ['user_id = ?'];
    const values = [req.user.id];
    if (category) { clauses.push('category = ?'); values.push(category); }
    if (location) { clauses.push('storage_location = ?'); values.push(location); }
    if (status) { clauses.push('status = ?'); values.push(status); }
    if (search) { clauses.push('name LIKE ?'); values.push(`%${search}%`); }
    const order = {
      expiry_asc: 'expiry_date ASC',
      expiry_desc: 'expiry_date DESC',
      name: 'name ASC',
      created_desc: 'created_at DESC',
    }[sort] || 'expiry_date ASC';
    const [items] = await pool.execute(
      `${itemSelect} WHERE ${clauses.join(' AND ')} ORDER BY ${order}`,
      values,
    );
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
});

router.post('/', [
  body('name').trim().isLength({ min: 1, max: 180 }),
  body('category').trim().isLength({ min: 1, max: 80 }),
  body('storageLocation').optional().trim().isLength({ max: 80 }),
  body('storage').optional().trim().isLength({ max: 80 }),
  body('quantity').isFloat({ min: 0 }),
  body('unit').trim().isLength({ min: 1, max: 24 }),
  body('expiryDate').optional({ values: 'null' }).isISO8601(),
  body('purchaseDate').optional({ values: 'null' }).isISO8601(),
  body('weightKg').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('estimatedValue').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('co2ImpactKg').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('barcode').optional({ values: 'null' }).isString().isLength({ max: 80 }),
  body('notes').optional({ values: 'null' }).isString().isLength({ max: 1000 }),
  validate,
], async (req, res, next) => {
  try {
    const { name, category, quantity, unit, expiryDate, purchaseDate, weightKg, estimatedValue, co2ImpactKg, barcode, notes } = req.body;
    const storageLocation = req.body.storageLocation || req.body.storage || 'Fridge';
    const normalized = normalizeQuantity(quantity, unit, weightKg);
    const [result] = await pool.execute(
      `INSERT INTO inventory_items
       (user_id, name, category, storage_location, quantity, unit, expiry_date, purchase_date,
        barcode, weight_kg, estimated_value, co2_impact_kg, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, category, storageLocation, normalized.quantity, normalized.unit,
        expiryDate || null, purchaseDate || null, barcode || null, normalized.weightKg,
        estimatedValue ?? null, co2ImpactKg ?? null, notes || null],
    );
    const [items] = await pool.execute(`${itemSelect} WHERE id = ? AND user_id = ?`, [result.insertId, req.user.id]);
    return res.status(201).json({ item: items[0] });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', [
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().isLength({ min: 1, max: 180 }),
  body('category').optional().trim().isLength({ min: 1, max: 80 }),
  body('storageLocation').optional().trim().isLength({ max: 80 }),
  body('storage').optional().trim().isLength({ max: 80 }),
  body('quantity').optional().isFloat({ min: 0 }),
  body('unit').optional().trim().isLength({ min: 1, max: 24 }),
  body('expiryDate').optional({ values: 'null' }).isISO8601(),
  body('purchaseDate').optional({ values: 'null' }).isISO8601(),
  body('weightKg').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('estimatedValue').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('co2ImpactKg').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('barcode').optional({ values: 'null' }).isString().isLength({ max: 80 }),
  body('notes').optional({ values: 'null' }).isString().isLength({ max: 1000 }),
  validate,
], async (req, res, next) => {
  try {
    const fields = {
      name: 'name', category: 'category', storageLocation: 'storage_location',
      storage: 'storage_location', quantity: 'quantity', unit: 'unit',
      expiryDate: 'expiry_date', purchaseDate: 'purchase_date', weightKg: 'weight_kg',
      estimatedValue: 'estimated_value', co2ImpactKg: 'co2_impact_kg',
      barcode: 'barcode', notes: 'notes',
    };
    const updates = [];
    const values = [];
    let quantity = req.body.quantity;
    let unit = req.body.unit;
    const changesQuantity = Object.hasOwn(req.body, 'quantity') || Object.hasOwn(req.body, 'unit');
    if (changesQuantity) {
      const [current] = await pool.execute(
        'SELECT quantity, unit FROM inventory_items WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
      );
      if (!current[0]) return res.status(404).json({ error: 'Inventory item not found' });
      quantity = quantity ?? current[0].quantity;
      unit = unit ?? current[0].unit;
    }
    for (const [input, column] of Object.entries(fields)) {
      if (['quantity', 'unit'].includes(input)) continue;
      if (input === 'weightKg' && changesQuantity) continue;
      if (Object.hasOwn(req.body, input)) {
        updates.push(`${column} = ?`);
        values.push(req.body[input] ?? null);
      }
    }
    if (changesQuantity && quantity !== undefined && unit !== undefined) {
      const normalized = normalizeQuantity(quantity, unit, req.body.weightKg);
      updates.push('quantity = ?', 'unit = ?');
      values.push(normalized.quantity, normalized.unit);
      if (normalized.weightKg !== null) {
        updates.push('weight_kg = ?');
        values.push(normalized.weightKg);
      }
    }
    if (!updates.length) return res.status(400).json({ error: 'No fields were provided to update' });
    values.push(req.params.id, req.user.id);
    const [result] = await pool.execute(
      `UPDATE inventory_items SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values,
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Inventory item not found' });
    const [items] = await pool.execute(`${itemSelect} WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    return res.json({ item: items[0] });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/status', [
  param('id').isInt({ min: 1 }),
  body('status').isIn(['active', 'consumed', 'donated', 'used_in_recipe', 'discarded']),
  validate,
], async (req, res, next) => {
  try {
    const item = await withTransaction(async (connection) => {
      const [items] = await connection.execute(
        'SELECT id, weight_kg, quantity, unit, status FROM inventory_items WHERE id = ? AND user_id = ? FOR UPDATE',
        [req.params.id, req.user.id],
      );
      if (!items[0]) {
        const error = new Error('Inventory item not found');
        error.statusCode = 404;
        throw error;
      }
      const existing = items[0];
      if (existing.status !== 'active') {
        const error = new Error('Only active items can change status');
        error.statusCode = 409;
        throw error;
      }
      const weightKg = Number(existing.weight_kg || (
        existing.unit === 'g' ? Number(existing.quantity) / 1000 : Number(existing.quantity) * 0.4
      ));
      await connection.execute('UPDATE inventory_items SET status = ? WHERE id = ?', [req.body.status, existing.id]);
      await awardForStatus(connection, req.user.id, req.body.status, existing.id, weightKg);
      const [updated] = await connection.execute(
        `${itemSelect} WHERE id = ? AND user_id = ?`,
        [existing.id, req.user.id],
      );
      return updated[0];
    });
    return res.json({ item });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', [param('id').isInt({ min: 1 }), validate], async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM inventory_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Inventory item not found' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
