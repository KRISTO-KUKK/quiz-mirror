const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const { requireAdmin } = require('../middleware/auth');

// ── POST /api/admin/login ──
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const valid = process.env.ADMIN_PASSWORD
      ? password === process.env.ADMIN_PASSWORD
      : await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ success: true, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ── GET /api/admin/stats ──
router.get('/stats', requireAdmin, async (req, res) => {
  try {
     const [[stats]] = await db.query(`
       SELECT
         COUNT(*) as total_started,
         SUM(status = 'completed') as total_completed,
         SUM(status = 'abandoned') as total_abandoned,
         ROUND(AVG(CASE WHEN status = 'abandoned' THEN last_question END), 1) as avg_dropoff
       FROM quiz_attempts
     `);
     const rate = stats.total_started > 0
       ? ((stats.total_completed / stats.total_started) * 100).toFixed(1)
       : 0;
     return res.json({ ...stats, completion_rate: parseFloat(rate) });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ── GET /api/admin/log ──
router.get('/log', requireAdmin, async (req, res) => {
  try {
     const [rows] = await db.query(`
       SELECT
         qa.id, s.name, s.email,
         qa.started_at, qa.completed_at,
         qa.status, qa.last_question,
         qa.result_stage, qa.result_archetype
       FROM quiz_attempts qa
       JOIN sessions s ON s.id = qa.session_id
       ORDER BY qa.started_at DESC
       LIMIT 100
     `);
     return res.json(rows);

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
