const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/(?:^|;\s*)userToken=([^;]+)/);
  if (!match) return res.redirect('/access');
  try {
    jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.redirect('/access');
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
