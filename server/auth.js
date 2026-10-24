import jwt from 'jsonwebtoken';

const jwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return process.env.JWT_SECRET;
};

export function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    jwtSecret(),
    { expiresIn: '7d' },
  );
}

export function publicUser(user) {
  let preferences = user.preferences || {};
  if (typeof preferences === 'string') preferences = JSON.parse(preferences);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    units: user.units,
    darkMode: Boolean(user.dark_mode),
    ecoScore: user.eco_score,
    streak: user.streak,
    location: user.location || '',
    bio: user.bio || '',
    preferences,
    createdAt: user.created_at,
  };
}
