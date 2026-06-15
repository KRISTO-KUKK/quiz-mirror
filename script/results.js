/* ── RESULTS.JS — Tulemuste töötlemine (quiz.ejs) ── */

/* ── PROCESSING ── */
function startProcessing() {
  goTo('screen-processing');
  const bar = document.getElementById('proc-bar');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 8 + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
      setTimeout(showResults, 500);
    }
    bar.style.width = pct + '%';
  }, 150);
}

/* ── SHOW RESULTS ── */
function showResults() {
  const stage        = calculateStage(answers1);
  const archetypeIdx = calculateArchetype(answers2);
  const archetype    = ARCHETYPES[archetypeIdx];

  sessionStorage.setItem('resultStage',     stage);
  sessionStorage.setItem('resultArchetype', archetype);

  const attemptId = sessionStorage.getItem('attemptId');

  fetch('/api/quiz/complete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ attemptId: attemptId ? parseInt(attemptId) : null, answersS1: answers1, answersS2: answers2 }),
  }).catch(() => {});

  window.location.href = '/results';
}
