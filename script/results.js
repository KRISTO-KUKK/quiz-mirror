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
  const key          = `${stage}_${archetype}`;
  const data         = RESULT_DATA[key] || RESULT_DATA[`Stabilising_${archetype}`] || {};

  sessionStorage.setItem('resultStage',          stage);
  sessionStorage.setItem('resultArchetype',      archetype);
  sessionStorage.setItem('resultDescription',    data.description    || '');
  sessionStorage.setItem('resultFeeling',        data.feeling        || '');
  sessionStorage.setItem('resultThrive',         data.thrive         || '');
  sessionStorage.setItem('resultPossible',       data.possible       || '');
  sessionStorage.setItem('resultRightNow',       data.rightNow       || '');
  sessionStorage.setItem('resultNext90',         data.next90         || '');
  sessionStorage.setItem('resultRecommendation', data.recommendation || '');

  const email     = sessionStorage.getItem('userEmail') || '';
  const name      = sessionStorage.getItem('userName')  || '';
  const attemptId = sessionStorage.getItem('attemptId');

  fetch('/api/quiz/complete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ attemptId: attemptId ? parseInt(attemptId) : null, answersS1: answers1, answersS2: answers2, email, name }),
  }).catch(() => {});

  window.location.href = '/results';
}
