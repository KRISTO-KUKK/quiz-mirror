const express      = require('express');
const router       = require('express').Router();
const nodemailer   = require('nodemailer');
const db        = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ── SKOORIMISLOOGIKA ──

const ARCHETYPES = [
  'Nest Rebuilder',        // 0
  'Rising Calf',           // 1
  'Grounded Giant',        // 2
  'Re-Emerging Butterfly'  // 3
];

const Q1_MAP = {
  0: 0,  // New to this country          → Nest Rebuilder
  1: 0,  // Adjusting, new environment   → Nest Rebuilder
  2: 1,  // Integrated, next level       → Rising Calf
  3: 2,  // Home country, stuck          → Grounded Giant
  4: 3   // Working remotely, no path    → Re-Emerging Butterfly
};

const Q2_MAP = {
  0: 2,  // Experienced, stuck            → Grounded Giant
  1: 1,  // Mid-level, wants leadership   → Rising Calf
  2: 0,  // Rebuilding (new country/field)→ Nest Rebuilder
  3: 3   // Re-emerging after pause       → Re-Emerging Butterfly
};

function calculateStage(answers) {
  const score = answers.reduce((sum, v) => sum + (v ?? 0), 0);
  if (score <= 8)  return 'Surviving';
  if (score <= 16) return 'Stabilising';
  return 'Strategising';
}

function calculateArchetype(answers2) {
  const q1 = answers2[0] ?? 0;
  const q2 = answers2[1] ?? 0;
  const tag1 = Q1_MAP[q1];
  const tag2 = Q2_MAP[q2];
  return (tag1 === tag2) ? tag1 : tag2;
}

// ── POST /api/quiz/start ──
router.post('/start', async (req, res) => {
  try {
     const sessionId = req.body.sessionId ?? null;
     const [existing] = await db.query(
       'SELECT * FROM quiz_attempts WHERE session_id = ? AND status = "started"',
       [sessionId]
     );
     if (existing.length > 0) {
       const attempt = existing[0];
       return res.json({
         attemptId: attempt.id,
         status: attempt.status,
         lastQuestion: attempt.last_question,
         answersS1: attempt.answers_s1,
         answersS2: attempt.answers_s2,
       });
     }
     const [result] = await db.query(
       'INSERT INTO quiz_attempts (session_id) VALUES (?)',
       [sessionId]
     );
     return res.json({ attemptId: result.insertId, status: 'started', lastQuestion: 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});    

// ── POST /api/quiz/save-answer ──
router.post('/save-answer', async (req, res) => {
  try {
    const { attemptId, section, questionIndex, answer } = req.body;
    if (section === undefined || questionIndex === undefined || answer === undefined) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

     const field = section === 1 ? 'answers_s1' : 'answers_s2';
     const [rows] = await db.query(`SELECT ${field} FROM quiz_attempts WHERE id = ?`, [attemptId]);
     const answers = rows[0][field] ? JSON.parse(rows[0][field]) : [];
     answers[questionIndex] = answer;
     const globalIndex = section === 1 ? questionIndex + 1 : 12 + questionIndex + 1;
     await db.query(
       `UPDATE quiz_attempts SET ${field} = ?, last_question = ? WHERE id = ?`,
       [JSON.stringify(answers), globalIndex, attemptId]
     );

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ── POST /api/quiz/abandon ──
router.post('/abandon', async (req, res) => {
  try {
    const { attemptId } = req.body;
    if (!attemptId) return res.sendStatus(204);
    await db.query(
      `UPDATE quiz_attempts SET status = 'abandoned' WHERE id = ? AND status = 'started'`,
      [attemptId]
    );
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// ── POST /api/quiz/complete ──
router.post('/complete', async (req, res) => {
  try {
    const { attemptId, answersS1, answersS2, email, name } = req.body;
    if (!answersS1 || !answersS2) {
      return res.status(400).json({ success: false, error: 'Missing answers' });
    }

    const stage        = calculateStage(answersS1);
    const archetypeIdx = calculateArchetype(answersS2);
    const archetype    = ARCHETYPES[archetypeIdx];

    if (attemptId) {
      await db.query(
        `UPDATE quiz_attempts
         SET status = 'completed', completed_at = NOW(),
             result_stage = ?, result_archetype = ?,
             answers_s1 = ?, answers_s2 = ?
         WHERE id = ? AND status = 'started'`,
        [stage, archetype, JSON.stringify(answersS1), JSON.stringify(answersS2), attemptId]
      );
    }

    // Saada tulemus e-postile (FN-KL7-1)
    if (email) {
      const greeting = name ? `Hi ${name},` : 'Hi,';
      transporter.sendMail({
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
      }).catch(err => console.error('Result email error:', err));
    }

    res.json({ success: true, stage, archetype, description });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;