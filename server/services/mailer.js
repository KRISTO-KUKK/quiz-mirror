const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAccessCode(name, email, code) {
  await transporter.sendMail({
    from:    `"Pullivara" <${process.env.EMAIL_USER}>`,
    to:      email,
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
}

async function sendResult(name, email, stage, archetype) {
  const greeting = name ? `Hi ${name},` : 'Hi,';
  await transporter.sendMail({
    from:    `"Pullivara" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: 'Your Career Clarity Snapshot — Pullivara',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a2e;">
        <h2>${greeting}</h2>
        <p>Here is your <strong>Career Clarity Snapshot</strong>:</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr>
            <td style="padding:12px 16px;background:#f5f0e8;font-weight:bold;width:40%;">Career Stage</td>
            <td style="padding:12px 16px;background:#faf8f3;">${stage}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#f5f0e8;font-weight:bold;">Career Persona</td>
            <td style="padding:12px 16px;background:#faf8f3;">${archetype}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #ddd;margin:32px 0;">
        <p style="color:#888;font-size:13px;">Warmly,<br><strong>Pullivara Group</strong></p>
      </div>
    `,
  });
}

module.exports = { sendAccessCode, sendResult };
