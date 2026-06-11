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

/* ── RESULT DATA (Stage × Archetype from spec) ── */
const RESULT_DATA = {

  /* ═══ SURVIVING ═══ */
  'Surviving_Grounded Giant': {
    description:     "You've built deep experience — but right now, you're stuck in a system or role that no longer fits. This stage is not a failure — it's a call to rest, reorient, and re-claim your strength.",
    feeling:         "Heavy with wisdom but low on mobility",
    thrive:          "Safe, structured environments that don't demand reinvention",
    possible:        "Even in stillness, clarity and strategic recovery are possible",
    recommendation:  "Book a Visibility & Clarity Intensive to realign your experience with future-facing opportunities"
  },
  'Surviving_Nest Rebuilder': {
    description:     "You're new — to this country, this field, or this identity. That takes immense courage. Right now, focus on safety, income, and skill translation. Your clarity will grow from stability.",
    feeling:         "Out of sync or unsure how to position your past experience",
    thrive:          "Low-barrier roles and empathetic environments",
    possible:        "Local traction and recognition are within reach, one bridge at a time",
    recommendation:  "Start the 5-Step Immigrant Success Path for guidance on job market adaptation, visibility, and early wins"
  },
  'Surviving_Re-Emerging Butterfly': {
    description:     "You've stepped back — now you're stretching your wings again. This stage is tender. Focus on low-pressure roles, energy recovery, and micro-visibility.",
    feeling:         "Unsure of your pace or capacity",
    thrive:          "Supportive teams or project-based roles",
    possible:        "Mini wins will rebuild momentum and self-trust",
    recommendation:  "Book a Rest-to-Relaunch Session designed to help you plan a soft return that honours your story"
  },
  'Surviving_Rising Calf': {
    description:     "You're trying to grow, but the ground beneath you is soft. Instead of pushing upward, strengthen your footing — tools, clarity, community.",
    feeling:         "Eager but unsupported or misunderstood",
    thrive:          "Structured settings with clear roles that help build confidence",
    possible:        "This is a season for learning the rules before trying to lead",
    recommendation:  "Enroll in the Clarity Jumpstart Course to build your foundation and sharpen your visibility game"
  },
  'Surviving_Rebuilder': {
    description:     "You're in a meaningful but tender transition. Right now, the priority is stability — income, grounding, and small steps forward. Every anchor you build now is a foundation for what comes next.",
    feeling:         "Somewhere between uncertain and quietly determined",
    thrive:          "Supportive, low-pressure environments with room to grow steadily",
    possible:        "Stability is closer than it feels — and it's the launchpad for everything ahead",
    recommendation:  "Start with the 5-Step Immigrant Success Path to build your footing and gain early traction"
  },

  /* ═══ STABILISING ═══ */
  'Stabilising_Grounded Giant': {
    description:     "You're starting to move again. That power you carry is real. Use this phase to test small pivots, rewrite your career story, and rebuild your network from a fresh center.",
    feeling:         "Cautious but hopeful",
    thrive:          "Environments that allow small experiments with support",
    possible:        "Strategic recovery now leads to smarter leaps later",
    recommendation:  "Join the Career Story Rewrite Workshop to repurpose your past into powerful positioning"
  },
  'Stabilising_Nest Rebuilder': {
    description:     "You've survived the landing. Now, build your nest. Start by translating your skills, joining local networks, and piloting roles or side-projects that feel aligned.",
    feeling:         "Semi-settled but not fully seen",
    thrive:          "Familiar but flexible roles with growth possibility",
    possible:        "Relationships and skill translation now = traction later",
    recommendation:  "Download the Local Leverage Toolkit to translate your experience for new opportunities"
  },
  'Stabilising_Re-Emerging Butterfly': {
    description:     "You're back — but not at full speed. This is your rebuild era. Choose projects that stretch gently. Make visibility feel safe again. You're not starting from scratch — you're starting from experience.",
    feeling:         "Wiser but wobbly",
    thrive:          "Gentle accountability and low-stakes exposure",
    possible:        "You're allowed to rebrand while still recovering",
    recommendation:  "Join a Visibility Reset Circle to re-enter safely while building strength"
  },
  'Stabilising_Rising Calf': {
    description:     "You've grown stronger — now it's time to step forward. Try on leadership shadows, ask for stretch assignments, and explore your values. Visibility is calling.",
    feeling:         "Ready but unsure where to start",
    thrive:          "Project ownership and internal visibility",
    possible:        "People are watching. Step up softly — then strategically",
    recommendation:  "Book a Mid-Level Momentum Mapping Session to prep for your leadership leap"
  },
  'Stabilising_Rebuilder': {
    description:     "You're finding your rhythm. The fog is lifting and you're beginning to see what's possible. This is the phase to experiment, connect, and refine what you're building toward.",
    feeling:         "Like you're almost there — but not quite sure what 'there' looks like yet",
    thrive:          "Roles with flexibility and room to test new directions",
    possible:        "Clarity comes through action — your next step will reveal the one after it",
    recommendation:  "Download the Local Leverage Toolkit to sharpen how you position and present yourself"
  },

  /* ═══ STRATEGISING ═══ */
  'Strategising_Grounded Giant': {
    description:     "You've done the inner work — now it's time to reframe your power. Lead from wisdom. Take up space. Package your career story and show up as the authority you already are.",
    feeling:         "Seasoned but under-recognised",
    thrive:          "High-autonomy roles or thought leadership paths",
    possible:        "It's time to build presence that matches your power",
    recommendation:  "Book a Personal Brand Authority Intensive to elevate your story and step into legacy-building roles"
  },
  'Strategising_Nest Rebuilder': {
    description:     "Your transition has become transformation. Now's the time to pitch boldly, claim visibility, and join decision-making spaces. Your outsider lens is your leadership edge.",
    feeling:         "Stronger than others perceive you to be",
    thrive:          "Leadership-track roles in mission-driven organisations",
    possible:        "You're not just ready — you're rare",
    recommendation:  "Apply for the Bold Transition Accelerator to own your value and position yourself for high-impact roles"
  },
  'Strategising_Re-Emerging Butterfly': {
    description:     "You've re-emerged with clarity. Let's make this era yours. Think platform-building, thought leadership, mentoring others. You're here to lead differently — and people are watching.",
    feeling:         "Pulled to share your story or shape systems",
    thrive:          "Hybrid roles or portfolio careers that let you fly wide",
    possible:        "Your voice is valid — and needed",
    recommendation:  "Join the Legacy Builder Lab to shape your platform, message, and mentorship model"
  },
  'Strategising_Rising Calf': {
    description:     "You're ready for the leap. Apply for that role. Launch that idea. Get seen. Your next season is not about proving — it's about positioning.",
    feeling:         "Ambitious but craving strategy and mentorship",
    thrive:          "Roles with influence and mentorship duties",
    possible:        "This is your chance to become who you once admired",
    recommendation:  "Start the Strategic Ascent Program for mid-level leaders preparing for bold transitions"
  },
  'Strategising_Rebuilder': {
    description:     "You've made it through and come out with hard-earned clarity. Now it's time to own your story, lead with intention, and claim the space you've earned.",
    feeling:         "Clear-eyed and ready to move with purpose",
    thrive:          "Environments where your resilience is seen as an asset",
    possible:        "Your story is your strategy — use it boldly",
    recommendation:  "Book a Personal Brand Authority Intensive to step confidently into your next chapter"
  }
};

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
  const key          = `${stage}_${archetype}`;
  const data         = RESULT_DATA[key] || RESULT_DATA[`Stabilising_${archetype}`] || {};

  sessionStorage.setItem('resultStage',          stage);
  sessionStorage.setItem('resultArchetype',      archetype);
  sessionStorage.setItem('resultDescription',    data.description    || '');
  sessionStorage.setItem('resultFeeling',        data.feeling        || '');
  sessionStorage.setItem('resultThrive',         data.thrive         || '');
  sessionStorage.setItem('resultPossible',       data.possible       || '');
  sessionStorage.setItem('resultRecommendation', data.recommendation || '');

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