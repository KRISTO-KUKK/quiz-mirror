/* ── MAIN.JS — Initsialiseerimine (quiz.ejs) ── */

document.addEventListener('DOMContentLoaded', async () => {
  const verified  = sessionStorage.getItem('userEmail');
  const sessionId = sessionStorage.getItem('sessionId');
  if (!verified) {
    window.location.href = '/access';
    return;
  }

  try {
    const res  = await fetch('/api/quiz/start', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sessionId: sessionId ? parseInt(sessionId) : null }),
    });
    const data = await res.json();
    if (data.attemptId) sessionStorage.setItem('attemptId', data.attemptId);
    resumeQuiz(data);            // taasta pooleli jäänud test (või alusta algusest)
  } catch (e) {
    console.error('Quiz start error:', e);
    goTo('screen-intro1');       // võrgu/serveri viga → tavaline algus
  }
});