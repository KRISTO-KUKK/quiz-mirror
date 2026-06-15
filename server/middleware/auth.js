const jwt = require('jsonwebtoken');
const db = require('../db');

function rejectUnauthorized(req, res) {
  res.clearCookie('userToken');
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return res.redirect('/access');
}

async function requireAuth(req, res, next) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/(?:^|;\s*)userToken=([^;]+)/);
  if (!match) return rejectUnauthorized(req, res);

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id, name, email FROM sessions WHERE id = ? AND authenticated = 1 LIMIT 1',
      [payload.sessionId]
    );

    if (rows.length === 0) throw new Error('Session not found');
    req.auth = rows[0];
    next();
  } catch {
    return rejectUnauthorized(req, res);
  }
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Forbidden' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error();
    next();
  } catch {
    res.status(403).json({ error: 'Forbidden' });
  }
}

module.exports = { requireAuth, requireAdmin };
