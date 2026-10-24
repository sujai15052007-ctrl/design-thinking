import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((item) => item.msg).join(', '),
      details: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  return next();
}
