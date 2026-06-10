const express      = require('express');
const router       = require('express').Router();
const nodemailer   = require('nodemailer');
// const db        = require('../db'); // ← lahti kommenteerida kui DB on valmis

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ── SKOORIMISLOOGIKA ──

const ARCHETYPES = [
  'Nest Rebuilder',         // 0
  'Rebuilder',              // 1
  'Rising Calf',            // 2
  'Grounded Giant',         // 3
  'Re-Emerging Butterfly'   // 4
];

const DESCRIPTIONS = [
  "This unique combination reflects your current reality and potential career pathway. You're experienced, perhaps even overqualified, but you feel undervalued, unseen, or out of sync with your current environment. This mix can be frustrating, especially when you know you have more to offer.\n\nRight now, your challenge isn't lack of skill, it's misalignment. Systems, structures, or seasons of life may be weighing you down. But there is power in pausing and recalibrating.",
  "You're in a meaningful transition — moving from where you were to where you're meant to be. The path forward requires clarity on your values, your strengths, and the environments where you thrive.",
  "You have the momentum and the vision. This is the phase to be strategic about the opportunities you pursue, the relationships you cultivate, and the legacy you're beginning to build.",
  "You've found your footing and you're grounded. Now it's about expanding your reach while staying true to your values and what's working well for you.",
  "You're ready to take bold leaps into new territory. Your resilience and adaptability are your greatest assets as you pioneer your next chapter."
];

const Q1_MAP = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };
const Q2_MAP = { 0: 3, 1: 2, 2: 0, 3: 4 };

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
    // TODO: DB versioon
    // const sessionId = req.session.sessionId;
    // const [existing] = await db.query(
    //   'SELECT * FROM quiz_attempts WHERE session_id = ? AND status = "started"',
    //   [sessionId]
    // );
    // if (existing.length > 0) {
    //   const attempt = existing[0];
    //   return res.json({
    //     attemptId: attempt.id,
    //     status: attempt.status,
    //     lastQuestion: attempt.last_question,
    //     answersS1: attempt.answers_s1,
    //     answersS2: attempt.answers_s2,
    //   });
    // }
    // const [result] = await db.query(
    //   'INSERT INTO quiz_attempts (session_id) VALUES (?)',
    //   [sessionId]
    // );
    // return res.json({ attemptId: result.insertId, status: 'started', lastQuestion: 0 });

    // Ajutine in-memory versioon (kuni DB on valmis)
    res.json({ attemptId: null, status: 'started', lastQuestion: 0, answersS1: null, answersS2: null });
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

    // TODO: DB versioon
    // const field = section === 1 ? 'answers_s1' : 'answers_s2';
    // const [rows] = await db.query(`SELECT ${field} FROM quiz_attempts WHERE id = ?`, [attemptId]);
    // const answers = rows[0][field] ? JSON.parse(rows[0][field]) : [];
    // answers[questionIndex] = answer;
    // const globalIndex = section === 1 ? questionIndex + 1 : 12 + questionIndex + 1;
    // await db.query(
    //   `UPDATE quiz_attempts SET ${field} = ?, last_question = ? WHERE id = ?`,
    //   [JSON.stringify(answers), globalIndex, attemptId]
    // );

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ── POST /api/quiz/complete ──
router.post('/complete', async (req, res) => {
  try {
    const { answersS1, answersS2, email, name } = req.body;
    if (!answersS1 || !answersS2) {
      return res.status(400).json({ success: false, error: 'Missing answers' });
    }

    const stage        = calculateStage(answersS1);
    const archetypeIdx = calculateArchetype(answersS2);
    const archetype    = ARCHETYPES[archetypeIdx];
    const description  = DESCRIPTIONS[archetypeIdx];

    // TODO: DB versioon
    // await db.query(`UPDATE quiz_attempts SET status='completed', ...`);

    // Saada tulemus e-postile (FN-KL7-1)
    if (email) {
      const greeting = name ? `Hi ${name},` : 'Hi,';
      const descHtml = description.replace(/\n/g, '<br><br>');
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
            <h3 style="color:#b89a2a;">Your Profile</h3>
            <p>${descHtml}</p>
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