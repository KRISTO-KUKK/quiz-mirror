require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// In-memory code store: { email -> { code, expiresAt } }
const codes = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/send-code', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing name or email' });

  const code = crypto.randomInt(100000, 999999).toString();
  codes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min

  try {
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
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing fields' });

  const entry = codes.get(email);
  if (!entry) return res.status(400).json({ error: 'No code found for this email' });
  if (Date.now() > entry.expiresAt) {
    codes.delete(email);
    return res.status(400).json({ error: 'Code expired' });
  }
  if (entry.code !== code.trim()) return res.status(400).json({ error: 'Incorrect code' });

  codes.delete(email);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
