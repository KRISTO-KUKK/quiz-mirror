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

/* ── NAVIGATION ── */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── ACCESS ── */
async function sendCode() {
  const name = document.getElementById('input-name').value.trim();
  const email = document.getElementById('input-email').value.trim();
  if (!name || !email) { alert('Please fill in your name and email.'); return; }

  const btn = document.querySelector('#screen-access .btn-gold');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send');
    document.getElementById('modal-email').classList.add('open');
  } catch (err) {
    alert('Could not send code: ' + err.message);
  } finally {
    btn.textContent = 'Send code';
    btn.disabled = false;
  }
}

function closeModal() {
  document.getElementById('modal-email').classList.remove('open');
}

async function enterCode() {
  const email = document.getElementById('input-email').value.trim();
  const code = document.getElementById('input-code').value.trim();
  if (!code) { alert('Please enter the access code.'); return; }

  const btn = document.querySelector('#modal-email .btn-dark');
  btn.textContent = 'Verifying...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid code');
    closeModal();
    goTo('screen-intro1');
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    btn.textContent = 'Enter';
    btn.disabled = false;
  }
}

/* ── SECTION 1 ── */
function startSection1() {
  currentSection = 1;
  currentQ = 0;
  renderQuestion();
  goTo('screen-question');
}

/* ── SECTION 2 ── */
function startSection2() {
  currentSection = 2;
  currentQ = 0;
  renderQuestion();
  goTo('screen-question');
}

/* ── RENDER QUESTION ── */
function renderQuestion() {
  const questions = currentSection === 1 ? section1 : section2;
  const total = questions.length;
  const q = questions[currentQ];
  const answers = currentSection === 1 ? answers1 : answers2;

  document.getElementById('q-progress').textContent = `${currentQ + 1}/${total}`;
  document.getElementById('q-text').textContent = q.q;

  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'radio-option';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'q-option';
    radio.id = `opt-${i}`;
    radio.value = i;
    if (answers[currentQ] === i) radio.checked = true;
    const label = document.createElement('label');
    label.htmlFor = `opt-${i}`;
    label.textContent = opt;
    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    opts.appendChild(wrapper);
  });

  document.getElementById('btn-prev').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('btn-next').textContent = currentQ === total - 1 ? 'Finish' : 'Next question';
}

function getSelected() {
  const radios = document.querySelectorAll('input[name="q-option"]');
  for (const r of radios) { if (r.checked) return parseInt(r.value); }
  return null;
}

function nextQuestion() {
  const sel = getSelected();
  if (sel === null) { alert('Please select an answer before continuing.'); return; }

  const questions = currentSection === 1 ? section1 : section2;
  if (currentSection === 1) answers1[currentQ] = sel;
  else answers2[currentQ] = sel;

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
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

/* ── PROCESSING ── */
function startProcessing() {
  goTo('screen-processing');
  const bar = document.getElementById('proc-bar');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 8 + 2;
    if (pct >= 100) { pct = 100; clearInterval(iv); setTimeout(showResults, 500); }
    bar.style.width = pct + '%';
  }, 150);
}

/* ── RESULTS ── */
const stages = ['Surviving', 'Stabilising', 'Strategising'];
const archetypes = [
  'The Resilient Re-builder',
  'The Purposeful Transitioner',
  'The Strategic Climber',
  'The Grounded Integrator',
  'The Bold Pioneer'
];
const descriptions = [
  "This unique combination reflects your current reality and potential career pathway. You're experienced, perhaps even overqualified, but you feel undervalued, unseen, or out of sync with your current environment. This mix can be frustrating, especially when you know you have more to offer.\n\nRight now, your challenge isn't lack of skill, it's misalignment. Systems, structures, or seasons of life may be weighing you down. But there is power in pausing and recalibrating.",
  "You're in a meaningful transition — moving from where you were to where you're meant to be. The path forward requires clarity on your values, your strengths, and the environments where you thrive.",
  "You have the momentum and the vision. This is the phase to be strategic about the opportunities you pursue, the relationships you cultivate, and the legacy you're beginning to build.",
  "You've found your footing and you're grounded. Now it's about expanding your reach while staying true to your values and what's working well for you.",
  "You're ready to take bold leaps into new territory. Your resilience and adaptability are your greatest assets as you pioneer your next chapter."
];

function showResults() {
  const score1 = answers1.reduce((a, v) => a + (v || 0), 0);
  const stageIdx = score1 < 8 ? 0 : score1 < 16 ? 1 : 2;
  const archetypeIdx = answers2[0] !== null ? answers2[0] % archetypes.length : 0;

  document.getElementById('res-stage').textContent = stages[stageIdx];
  document.getElementById('res-archetype').textContent = archetypes[archetypeIdx];
  document.getElementById('res-text').innerHTML = descriptions[archetypeIdx].replace(/\n/g, '<br><br>');

  goTo('screen-results');
}
