/* ── MAIN.JS — Initsialiseerimine (quiz.ejs) ── */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res  = await fetch('/api/quiz/start', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({}),
    });
    if (!res.ok) {
      window.location.href = '/access';
      return;
    }
    const data = await res.json();
    if (data.attemptId) sessionStorage.setItem('attemptId', data.attemptId);
  } catch (e) {
    console.error('Quiz start error:', e);
  }

  goTo('screen-intro1');
});
