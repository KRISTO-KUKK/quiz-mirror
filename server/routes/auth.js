const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');
const crypto     = require('crypto');
const jwt        = require('jsonwebtoken');
const db         = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-code', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing name or email' });

  const code      = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await db.query(
      'INSERT INTO sessions (name, email, code, code_expires_at) VALUES (?, ?, ?, ?)',
      [name, email, code, expiresAt]
    );

    await transporter.sendMail({
      from: `"Pullivara" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Pullivara Access Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
          <h2 style="color:#1a1a2e;">Hi ${name},</h2>
          <p>Your access code for the Career Clarity Test is:</p>
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#b89a2a;margin:24px 0;">${code}</div>
          <p style="color:#888;font-size:13px;">This code expires in 10 minutes.</p>
          <p>Warmly,<br><strong>Pullivara Group</strong></p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing fields' });

  const [rows] = await db.query(
    'SELECT * FROM sessions WHERE email = ? AND code = ? AND code_used = 0 ORDER BY created_at DESC LIMIT 1',
    [email, code.trim()]
  );

  if (rows.length === 0) return res.status(400).json({ error: 'Invalid code' });

  const session = rows[0];
  if (new Date() > new Date(session.code_expires_at)) {
    return res.status(400).json({ error: 'Code expired' });
  }

  await db.query(
    'UPDATE sessions SET code_used = 1, authenticated = 1 WHERE id = ?',
    [session.id]
  );

  const token = jwt.sign(
    { sessionId: session.id, name: session.name },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('userToken', token, { httpOnly: true, sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 });
  res.json({ success: true, name: session.name, sessionId: session.id });
});

module.exports = router;