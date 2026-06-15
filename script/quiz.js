/* ── QUIZ.JS — Küsimuste andmed ja loogika ── */

/* ── DATA ── */
const section1 = [
  {
    q: "What best describes your current job status?",
    opts: [
      "Unemployed or between roles",
      "Employed but feeling unsettled or underutilised",
      "Actively employed and fairly content"
    ]
  },
  {
    q: "How confident are you navigating your current job market?",
    opts: [
      "Not very — it feels overwhelming",
      "Somewhat — I know a few things but feel uncertain",
      "Fairly — I have a good sense of what's out there"
    ]
  },
  {
    q: " How do you feel about your career direction right now?",
    opts: [
      "Lost or very unclear",
      "Starting to get clearer but still uncertain",
      "Fairly clear on where I'm headed"
    ]
  },
  {
    q: " How stable is your life overall right now?",
    opts: [
      "Very unstable — lots of changes at once",
      "Somewhat stable, but areas of uncertainty remain",
      "Mostly stable and grounded"
    ]
  },
  {
    q: "How supported do you feel professionally?",
    opts: [
      "Not supported at all",
      "Somewhat supported",
      "Well supported"
    ]
  },
  {
    q: "What is your current energy level for career growth?",
    opts: [
      "Low — I'm in survival mode",
      "Medium — I want to grow but I'm managing capacity",
      "High — I'm ready to push forward"
    ]
  },
  {
    q: "How visible are you professionally (online or in your community)?",
    opts: [
      "Not visible at all",
      "A little — I have some presence",
      "Quite visible — people know my work"
    ]
  },
  {
    q: "How clearly can you describe your professional goals?",
    opts: [
      "I can't really describe them yet",
      "I have a rough sense of what I want",
      "I can describe them clearly and specifically"
    ]
  },
  {
    q: "Which statement best reflects your readiness to act?",
    opts: [
      "I need to sort out basics before anything career-related",
      "I'm thinking about it and starting to plan",
      "I'm ready to take concrete action now"
    ]
  },
  {
    q: "How do you feel about asking for help or mentorship?",
    opts: [
      "Very uncomfortable — I wouldn't know who or how",
      "A little uncomfortable but I'm open to it",
      "Comfortable — I actively seek guidance"
    ]
  },
  {
    q: "How much control do you feel you have over your career?",
    opts: [
      "Very little — things feel out of my hands",
      "Some — I'm working on it",
      "A lot — I feel empowered to shape my path"
    ]
  },
  {
    q: "If your dream role appeared today, would you be ready?",
    opts: [
      "No — I don't feel ready at all",
      "Somewhat — I'd need some prep",
      "Yes — I'd go for it confidently"
    ]
  }
];

const section2 = [
  {
    q: "Which best describes your work context right now?",
    opts: [
      "New to this country or professional system",
      "Adjusting, but still navigating challenges in a new environment",
      "Integrated but looking for the next level",
      "In my home country but feeling stuck or underutilised",
      "Working remotely or globally, without a clear path forward"
    ]
  },
  {
    q: "Which of these best describes your current season of life?",
    opts: [
      "I'm an experienced professional but feel stuck or underutilised",
      "I'm in a mid-level role and want to grow into leadership or visibility",
      "I'm rebuilding in a new country, industry, or field",
      "I'm re-emerging after a pause, burnout, or caregiving"
    ]
  }
];

/* ── STATE ── */
let currentSection = 1;
let currentQ = 0;
let answers1 = new Array(12).fill(null);
let answers2 = new Array(2).fill(null);

/* ── START ── */
function startSection1() {
  currentSection = 1;
  currentQ = 0;
  renderQuestion();
  goTo('screen-question');
}

function startSection2() {
  currentSection = 2;
  currentQ = 0;
  renderQuestion();
  goTo('screen-question');
}

/* ── RESUME — taasta pooleli jäänud test serveri andmetest ──
   lastQuestion on globaalne loendur (vt save-answer): 0 = midagi vastamata,
   1–12 = sektsioon 1, 13–14 = sektsioon 2. */
function resumeQuiz(data) {
  const parseAnswers = (raw, len) => {
    let arr = [];
    if (Array.isArray(raw)) arr = raw;
    else if (typeof raw === 'string' && raw) { try { arr = JSON.parse(raw); } catch { arr = []; } }
    const out = new Array(len).fill(null);
    arr.forEach((v, i) => { if (i < len) out[i] = v; });
    return out;
  };

  answers1 = parseAnswers(data.answersS1, 12);
  answers2 = parseAnswers(data.answersS2, 2);

  const last = data.lastQuestion || 0;

  if (last <= 0) {                 // pole alustanud → tavaline algus
    goTo('screen-intro1');
  } else if (last < 12) {          // sektsioon 1 pooleli → järgmine vastamata küsimus
    currentSection = 1;
    currentQ = last;
    renderQuestion();
    goTo('screen-question');
  } else if (last === 12) {        // sektsioon 1 läbi → sektsiooni 2 sissejuhatus
    goTo('screen-intro2');
  } else {                         // sektsioon 2 pooleli (13) või kõik vastatud (14)
    currentSection = 2;
    currentQ = last < 14 ? last - 12 : 1;
    renderQuestion();
    goTo('screen-question');
  }
}

/* ── RENDER ── */
function renderQuestion() {
  const questions = currentSection === 1 ? section1 : section2;
  const total = questions.length;
  const q = questions[currentQ];
  const answers = currentSection === 1 ? answers1 : answers2;

  // Edenemisriba uuendamine
  document.getElementById('q-progress').textContent = `Question ${currentQ + 1} of ${total}`;
  const totalQuestions = 14; // 12 + 2
  const answered = currentSection === 1 ? currentQ : 12 + currentQ;
  const pct = Math.round((answered / totalQuestions) * 100);
  document.getElementById('prog-bar-fill').style.width = pct + '%';
  document.getElementById('prog-section1').classList.toggle('active', currentSection === 1);
  document.getElementById('prog-section2').classList.toggle('active', currentSection === 2);

  document.getElementById('q-text').textContent = q.q;

  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (answers[currentQ] === i ? ' selected' : '');
    btn.textContent = opt;
    btn.dataset.value = i;
    btn.addEventListener('click', () => {
      opts.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      hideError('error-question');
    });
    opts.appendChild(btn);
  });

  document.getElementById('btn-prev').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('btn-next').textContent = currentQ === total - 1 ? 'Finish' : 'Next question';
}

function getSelected() {
  const sel = document.querySelector('#q-options .choice-btn.selected');
  return sel ? parseInt(sel.dataset.value) : null;
}

/* ── NAVIGATION ── */
function nextQuestion() {
  const sel = getSelected();
  if (sel === null) {
    showError('error-question', 'Please select an answer before continuing.');
    return;
  }

  if (currentSection === 1) answers1[currentQ] = sel;
  else answers2[currentQ] = sel;

  const attemptId = sessionStorage.getItem('attemptId');
  if (attemptId) {
    fetch('/api/quiz/save-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId: parseInt(attemptId), section: currentSection, questionIndex: currentQ, answer: sel }),
    }).catch(() => {});
  }

  const questions = currentSection === 1 ? section1 : section2;
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    if (currentSection === 1) {
      goTo('screen-intro2');
    } else {
      startProcessing();
    }
  }
}

function prevQuestion() {
  if (currentQ > 0) {
    hideError('error-question');
    currentQ--;
    renderQuestion();
  }
}

/* ── ABANDON: saada serverile kui kasutaja lahkub ── */
window.addEventListener('beforeunload', () => {
  const attemptId = sessionStorage.getItem('attemptId');
  if (!attemptId) return;
  const payload = new Blob([JSON.stringify({ attemptId: parseInt(attemptId) })], { type: 'application/json' });
  navigator.sendBeacon('/api/quiz/abandon', payload);
});