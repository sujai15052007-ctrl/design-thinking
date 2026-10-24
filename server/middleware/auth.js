import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'You do not have permission to do this' });
    }
    return next();
  };
}
