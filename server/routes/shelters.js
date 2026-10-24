import { Router } from 'express';
import { query } from 'express-validator';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get('/', [
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lng').optional().isFloat({ min: -180, max: 180 }),
  validate,
], async (req, res, next) => {
  try {
    if ((req.query.lat && !req.query.lng) || (!req.query.lat && req.query.lng)) {
      return res.status(400).json({ error: 'Provide both lat and lng to sort by distance' });
    }
    let sql = `SELECT id, name, address, phone, accepts, lat, lng, opening_hours AS openingHours
      FROM shelters`;
    let values = [];
    if (req.query.lat && req.query.lng) {
      sql = `SELECT id, name, address, phone, accepts, lat, lng, opening_hours AS openingHours,
        (6371 * ACOS(LEAST(1, GREATEST(-1,
          COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(lat))
        )))) AS distanceKm
        FROM shelters ORDER BY distanceKm`;
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      values = [lat, lng, lat];
    } else {
      sql += ' ORDER BY name';
    }
    const [shelters] = await pool.execute(sql, values);
    return res.json({ shelters });
  } catch (error) {
    return next(error);
  }
});

export default router;
