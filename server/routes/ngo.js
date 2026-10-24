import { Router } from 'express';
import pool from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireRole('ngo'));

router.get('/incoming-donations', async (req, res, next) => {
  try {
    const [donations] = await pool.execute(
      `SELECT d.id, d.user_id AS userId, u.name AS donorName, s.name AS shelterName,
        i.name AS itemName, i.quantity, i.unit,
        COALESCE(d.verified_weight_kg, i.weight_kg) AS weightKg,
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

router.get('/stats', async (req, res, next) => {
  try {
    const [stats] = await pool.execute(
      `SELECT COUNT(*) AS donationCount,
        COALESCE(SUM(CASE WHEN d.status = 'completed' THEN COALESCE(d.verified_weight_kg, i.weight_kg) ELSE 0 END), 0) AS kgReceived
       FROM donations d JOIN inventory_items i ON i.id = d.item_id`,
    );
    return res.json({
      donationCount: Number(stats[0].donationCount),
      kgReceived: Number(stats[0].kgReceived),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
