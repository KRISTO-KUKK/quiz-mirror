/* ── RESULTS.JS — Tulemuste arvutamine ja kuvamine ── */

/* ── SCORING DATA ── */
const stages = ['Surviving', 'Stabilising', 'Strategising'];

const ARCHETYPES = [
  'Nest Rebuilder',         // 0
  'Rebuilder',              // 1
  'Rising Calf',            // 2
  'Grounded Giant',         // 3
  'Re-Emerging Butterfly'   // 4
];

const descriptions = [
  // 0 — Nest Rebuilder
  "This unique combination reflects your current reality and potential career pathway. You're experienced, perhaps even overqualified, but you feel undervalued, unseen, or out of sync with your current environment. This mix can be frustrating, especially when you know you have more to offer.\n\nRight now, your challenge isn't lack of skill, it's misalignment. Systems, structures, or seasons of life may be weighing you down. But there is power in pausing and recalibrating.",
  // 1 — Rebuilder
  "You're in a meaningful transition — moving from where you were to where you're meant to be. The path forward requires clarity on your values, your strengths, and the environments where you thrive.",
  // 2 — Rising Calf
  "You have the momentum and the vision. This is the phase to be strategic about the opportunities you pursue, the relationships you cultivate, and the legacy you're beginning to build.",
  // 3 — Grounded Giant
  "You've found your footing and you're grounded. Now it's about expanding your reach while staying true to your values and what's working well for you.",
  // 4 — Re-Emerging Butterfly
  "You're ready to take bold leaps into new territory. Your resilience and adaptability are your greatest assets as you pioneer your next chapter."
];

/* ── Q2 → archetype map ── */
const Q2_MAP = {
  0: 3,  // survival mode    → Grounded Giant
  1: 2,  // transition       → Rising Calf
  2: 0,  // growth phase     → Nest Rebuilder
  3: 4,  // rebuilding phase → Re-Emerging Butterfly
  4: 3   // legacy phase     → Grounded Giant
};

/* ── Q1 → archetype map ── */
const Q1_MAP = {
  0: 0,  // A → Nest Rebuilder
  1: 1,  // B → Rebuilder
  2: 2,  // C → Rising Calf
  3: 3,  // D → Grounded Giant
  4: 4   // E → Re-Emerging Butterfly
};

function calculateStage(ans) {
  const score = ans.reduce((sum, v) => sum + (v ?? 0), 0);
  if (score <= 8)  return 'Surviving';
  if (score <= 16) return 'Stabilising';
  return 'Strategising';
}

function calculateArchetype(ans2) {
  const q1 = ans2[0] ?? 0;
  const q2 = ans2[1] ?? 0;
  const tag1 = Q1_MAP[q1];
  const tag2 = Q2_MAP[q2];
  // Mõlemad sama → see võidab; erinevad → q2 võidab
  return (tag1 === tag2) ? tag1 : tag2;
}

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
  const description  = descriptions[archetypeIdx];

  sessionStorage.setItem('resultStage',       stage);
  sessionStorage.setItem('resultArchetype',   archetype);
  sessionStorage.setItem('resultDescription', description);

  const email = sessionStorage.getItem('userEmail') || '';
  const name  = sessionStorage.getItem('userName')  || '';

  const attemptId = sessionStorage.getItem('attemptId');
  fetch('/api/quiz/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attemptId: attemptId ? parseInt(attemptId) : null, answersS1: answers1, answersS2: answers2, email, name }),
  }).catch(() => {});

  window.location.href = '/results';
}