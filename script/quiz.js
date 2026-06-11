/* ── QUIZ.JS — Küsimuste andmed ja loogika ── */

/* ── DATA ── */
const section1 = [
  {
    q: "What best describes your current job status?",
    opts: [
      "I'm unemployed or doing anything I can to survive",
      "I have a job, but it's not aligned or ideal",
      "I'm working in a role that fits my skills and current goals"
    ]
  },
  {
    q: "How do you feel about your career direction right now?",
    opts: [
      "I feel lost, stuck, or disconnected from any direction",
      "I'm figuring it out and taking small steps",
      "I'm clear on what I want and moving towards it"
    ]
  },
  {
    q: "How confident are you navigating your current job market?",
    opts: [
      "I feel overwhelmed or unsure where to begin",
      "I have some understanding but still second-guess a lot",
      "I'm confident in my ability to navigate, search, and position myself"
    ]
  },
  {
    q: "How stable is your life overall?",
    opts: [
      "Things feel chaotic or uncertain in multiple areas",
      "Some parts are stable, others not yet",
      "My life is steady enough to plan and grow from"
    ]
  },
  {
    q: "How would you describe your energy and motivation right now?",
    opts: [
      "I'm exhausted and barely keeping up",
      "I have some drive but it comes and goes",
      "I'm energised and ready to invest in my growth"
    ]
  },
  {
    q: "How clear are you on your professional strengths?",
    opts: [
      "I'm not sure what I'm good at or how to communicate it",
      "I have a rough idea but struggle to articulate it clearly",
      "I know my strengths and can speak to them confidently"
    ]
  },
  {
    q: "How would you describe your professional network right now?",
    opts: [
      "I don't really have one or haven't started building",
      "I have some connections but haven't leveraged them much",
      "I have a solid network I actively use and grow"
    ]
  },
  {
    q: "How would you rate your current financial stability?",
    opts: [
      "I'm struggling financially and it's affecting my decisions",
      "I'm getting by but there's not much room to invest in myself",
      "I'm financially stable enough to focus on growth"
    ]
  },
  {
    q: "How do you feel about your resume and LinkedIn profile?",
    opts: [
      "They're outdated or don't reflect who I am now",
      "They exist but could be much stronger",
      "They're polished and accurately represent my value"
    ]
  },
  {
    q: "How often are you taking action towards your career goals?",
    opts: [
      "Rarely — I'm not sure where to start or what to do",
      "Sometimes — I try but I'm inconsistent",
      "Regularly — I have a plan and I'm working it"
    ]
  },
  {
    q: "How supported do you feel in your career journey?",
    opts: [
      "I feel very alone with little guidance or support",
      "I have some support but it's limited or inconsistent",
      "I have strong support systems that help me move forward"
    ]
  },
  {
    q: "What's your biggest career focus right now?",
    opts: [
      "Survival — getting income and stability",
      "Transition — finding a better fit or direction",
      "Growth — levelling up and expanding my impact"
    ]
  }
];

const section2 = [
  {
    q: "Which best describes your work context right now?",
    opts: [
      "I'm new to this country or system — still adapting and finding my footing",
      "I've been here a while, but I'm still figuring out how to thrive",
      "I'm fairly integrated but seeking to level up or expand",
      "I'm re-entering the workforce after a career break",
      "I'm pivoting into a completely new field or industry"
    ]
  },
  {
    q: "Which best describes your personal season right now?",
    opts: [
      "I'm in survival mode — focused on basics and stability",
      "I'm in transition — things are shifting and I'm finding my footing",
      "I'm in a growth phase — ready to invest and expand",
      "I'm in a rebuilding phase — recovering and redefining my path",
      "I'm in a legacy phase — seeking purpose and longer-term impact"
    ]
  }
];

/* ── STATE ── */
let currentSection = 1;
let currentQ = 0;
let answers1 = new Array(12).fill(null);
let answers2 = new Array(2).fill(null);
let currentAttemptId = null;

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
    currentQ--;
    renderQuestion();
  }
}