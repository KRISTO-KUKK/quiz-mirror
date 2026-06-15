const express      = require('express');
const router       = require('express').Router();
const nodemailer   = require('nodemailer');
const db        = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const { ARCHETYPES, calculateStage, calculateArchetype } = require('../scoring');

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