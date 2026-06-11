/* ── RESULTS.JS — Tulemuste arvutamine ja kuvamine ── */

/* ── SCORING DATA ── */
const stages = ['Surviving', 'Stabilising', 'Strategising'];

const ARCHETYPES = [
  'Nest Rebuilder',         // 1
  'Rising Calf',            // 2
  'Grounded Giant',         // 3
  'Re-Emerging Butterfly'   // 4
];

/* ── RESULT DATA (Stage × Archetype from spec) ── */
const RESULT_DATA = {

  /* ═══ SURVIVING ═══ */
  'Surviving_Grounded Giant': {
    description:    "You're experienced — perhaps even overqualified — but you feel underused, unseen, or out of sync with your current environment. Right now, your challenge isn't lack of skill, it's misalignment. Systems, structures, or seasons of life may be weighing you down. But there is power in pausing and recalibrating.\nThe thing holding you back isn't what you lack. It's the gap between the depth you carry and the rooms you've been placed in.",
    feeling:        "stuck, overlooked, or quietly resentful",
    thrive:         "clear, competence-driven spaces that recognise depth",
    possible:       "reconnection to purpose and low-stakes wins to build traction",
    rightNow:       "Reconnect to purpose and identify one or two low-stakes wins that rebuild your sense of momentum",
    next90:         "Reposition your professional narrative so the right opportunities can find you",
    recommendation: "Book a 30-minute Clarity Consultation to explore how to reposition without losing momentum. Get 25% off when you refer a friend who completes the test."
  },
  'Surviving_Rising Calf': {
    description:    "You've started something new — a job, industry, country, or life chapter — but you're still finding your footing. You're eager to grow, but the ground beneath you still feels a bit shaky. This moment requires nurturing, not pressure. You need permission to build slowly, to master small steps, and to regain your confidence in unfamiliar terrain.\nYour ambition is real and it's an asset. But right now, the most powerful thing you can do is slow down enough to build a foundation that actually holds.",
    feeling:        "underexposed or anxious about keeping up",
    thrive:         "structured guidance and environments that value potential over perfection",
    possible:       "supportive growth, early wins, and visible momentum",
    rightNow:       "Identify two or three structured steps that build confidence without overwhelming your current capacity",
    next90:         "Create early visible wins that start to tell the story of who you're becoming professionally",
    recommendation: "Book a 30-minute Clarity Consultation to set realistic goals and clarify your first few strategic moves. Get 25% off when you refer a friend who completes the test."
  },
  'Surviving_Nest Rebuilder': {
    description:    "You're rebuilding from scratch — whether in a new country, new field, or after a significant career detour. Your energy may feel scattered, but there's courage in your commitment to start over. This is your permission slip to simplify, reset, and trust that not every win has to come fast or loud. Survival today is the foundation for growth tomorrow.\nYou're not behind. You're building in unfamiliar terrain — and that takes a different kind of strength than most people ever have to find.",
    feeling:        "uncertain, disoriented, or emotionally tired",
    thrive:         "flexible, low-pressure environments that honour your context",
    possible:       "foundational clarity and slow, steady rebuilding",
    rightNow:       "Establish one or two anchoring wins that stabilise your confidence and prove to yourself that you belong here",
    next90:         "Translate your past experience into language and roles this new environment understands",
    recommendation: "Book a 30-minute Clarity Consultation to co-create a career plan that reflects your reality and capacity. Get 25% off when you refer a friend who completes the test."
  },
  'Surviving_Re-Emerging Butterfly': {
    description:    "You're returning from a pause — burnout, caregiving, relocation, recovery — and stepping into new territory again. That re-entry can feel raw. You are not behind. You are brave. Honour the soft steps. You're not meant to sprint right now. You're meant to re-emerge with strength, rhythm, and grace.\nRe-entry is its own kind of work. The world kept moving while you were doing something just as important. You don't owe anyone a fast comeback.",
    feeling:        "overwhelmed or uncertain about where to start",
    thrive:         "gentle re-entry zones with room to regain rhythm without performance pressure",
    possible:       "confidence-building structure and safe, small experiments",
    rightNow:       "Choose one gentle, low-pressure re-entry move that reminds you of your capability without overwhelming you",
    next90:         "Build a soft-return plan that grows your visibility at a pace that feels sustainable and honest",
    recommendation: "Book a 30-minute Clarity Consultation to plan your return with realism and care. Get 25% off when you refer a friend who completes the test."
  },

  /* ═══ STABILISING ═══ */
  'Stabilising_Grounded Giant': {
    description:    "You're starting to move again. That power you carry is real. Use this phase to test small pivots, rewrite your career story, and rebuild your network from a fresh centre. The ground is steadier now — and the momentum you build here will be smarter and sturdier than what came before.\nThis phase isn't limbo. It's the strategic pause before a well-timed move. The professionals who thrive at your level aren't faster — they're more intentional.",
    feeling:        "cautious but quietly hopeful",
    thrive:         "environments that allow small experiments with support",
    possible:       "strategic recovery now leads to smarter, better-timed leaps later",
    rightNow:       "Test one small pivot — a new framing, a new conversation, a new room — and notice what it opens up",
    next90:         "Rebuild your network from a fresh centre and start rewriting the career story you've been telling",
    recommendation: "Join the Career Story Rewrite Workshop to repurpose your experience into powerful, future-facing positioning."
  },
  'Stabilising_Rising Calf': {
    description:    "You've grown stronger — now it's time to step forward. You have more to offer than your current title suggests, and the people around you are starting to notice. This is your phase to try on leadership, ask for stretch assignments, and begin building the visibility that takes you to the next level.\nThe gap between where you are and where you're going isn't skill. It's visibility and strategy. Both are learnable. Both are available to you now.",
    feeling:        "ready but unsure exactly where to start",
    thrive:         "project ownership and internal visibility",
    possible:       "people are watching — step up softly, then strategically",
    rightNow:       "Take on one piece of work that stretches you into leadership territory and makes your capabilities visible",
    next90:         "Map out your next level clearly — what it looks like, what it requires, and who needs to see you getting there",
    recommendation: "Book a Mid-Level Momentum Mapping Session to prepare for your leadership leap and build the strategy to get there."
  },
  'Stabilising_Nest Rebuilder': {
    description:    "You've survived the landing. Now it's time to build your nest. The chaos of the early transition is behind you, and a steadier foundation is forming. Start translating your skills, joining local networks, and piloting roles or projects that feel genuinely aligned with who you are.\nYou're not starting over. You're starting informed — with experience, perspective, and a resilience most people in the room simply don't have.",
    feeling:        "semi-settled but not yet fully seen or recognised",
    thrive:         "familiar but flexible roles with room to grow",
    possible:       "relationships and skill translation now will create real traction later",
    rightNow:       "Begin translating your previous experience into language, formats, and contexts this new environment understands",
    next90:         "Invest in two or three relationships that can open doors and help your work become visible in the right places",
    recommendation: "Download the Local Leverage Toolkit to translate your experience into new opportunities and build traction in your current environment."
  },
  'Stabilising_Re-Emerging Butterfly': {
    description:    "You're back — but not yet at full speed, and that's exactly right. This is your rebuild era. Choose projects that stretch you gently. Make visibility feel safe again. You're not starting from scratch — you're starting from experience, wisdom, and a self-awareness most people never develop.\nYou're allowed to rebrand while still recovering. Growth and healing are not opposites — they can happen in the same season.",
    feeling:        "wiser than before but still a little wobbly in your professional confidence",
    thrive:         "gentle accountability and low-stakes visibility",
    possible:       "you're allowed to move at your own pace and still make meaningful progress",
    rightNow:       "Choose one project or opportunity that stretches you gently and begins to rebuild your professional presence",
    next90:         "Find one space — a community, a peer group, a mentor — where you can be visible without pressure",
    recommendation: "Join a Visibility Reset Circle to re-enter the professional world safely while rebuilding your confidence and strength."
  },

  /* ═══ STRATEGISING ═══ */
  'Strategising_Grounded Giant': {
    description:    "You've done the inner work — now it's time to reframe your power. Lead from wisdom. Take up space. Package your career story and show up as the authority you already are. The world needs professionals who carry depth, and you've earned the right to stand in it fully.\nYou don't need to prove anything to anyone. What you need now is the right stage — and the courage to claim it.",
    feeling:        "seasoned but still under-recognised or under-positioned",
    thrive:         "high-autonomy roles and thought leadership paths",
    possible:       "it's time to build a presence that matches the power you've been quietly carrying",
    rightNow:       "Package your career story deliberately — identify the narrative that positions you as the authority you are",
    next90:         "Move into at least one high-visibility space: a speaking opportunity, a published piece, a leadership table",
    recommendation: "Book a Personal Brand Authority Intensive to elevate your story and step confidently into legacy-building roles."
  },
  'Strategising_Rising Calf': {
    description:    "You're ready for the leap. Apply for that role. Launch that idea. Get seen. Your next season is not about proving yourself — it's about positioning yourself wisely and moving with intention. The difference between those two things is everything.\nThe version of you that once admired someone at the next level? That's who you're becoming. It's time to act like it.",
    feeling:        "ambitious and energised but craving a clearer strategy and stronger mentorship",
    thrive:         "roles with influence, ownership, and mentorship duties",
    possible:       "this is your season to become someone others look up to — step into it deliberately",
    rightNow:       "Apply for the role, pitch the idea, or make the ask you've been preparing for — momentum favours action",
    next90:         "Build your personal brand and visibility strategy so your ambition is legible to the people who can open doors",
    recommendation: "Start the Strategic Ascent Program for mid-level leaders preparing to make bold, well-positioned transitions."
  },
  'Strategising_Nest Rebuilder': {
    description:    "Your transition has become transformation. What began as rebuilding has turned into something far more powerful — a professional identity forged through real experience, resilience, and perspective. Now's the time to pitch boldly, claim visibility, and step into the decision-making spaces you've earned.\nYour outsider lens isn't a limitation. It's your leadership edge — and the organisations that truly understand value will recognise it.",
    feeling:        "stronger and more capable than others around you currently perceive",
    thrive:         "leadership-track roles in mission-driven organisations",
    possible:       "you're not just ready — you're rare, and it's time to own that",
    rightNow:       "Pitch boldly for the roles, projects, or partnerships that match where you actually are — not where you started",
    next90:         "Step into at least one decision-making space where your outsider perspective becomes a visible leadership asset",
    recommendation: "Apply for the Bold Transition Accelerator to own your full value and position yourself for high-impact, high-visibility roles."
  },
  'Strategising_Re-Emerging Butterfly': {
    description:    "You've re-emerged with clarity, and this era is yours to shape. Think platform-building, thought leadership, mentoring others who are where you once were. You're here to lead differently — with the full depth of everything you've lived through — and the people who need your voice are already waiting.\nWhat you've been through isn't baggage. It's your edge. The leaders people follow aren't the ones who've never struggled — they're the ones who came back with something real to say.",
    feeling:        "a strong pull to share your story, shape systems, or create visibility for others like you",
    thrive:         "hybrid roles, portfolio careers, and platform-building paths",
    possible:       "your voice is valid, necessary, and needed — it's time to use it with full intention",
    rightNow:       "Begin building your platform: identify your message, your audience, and the one channel where you'll show up consistently",
    next90:         "Step into a mentorship or community leadership role that lets your re-emergence story create a path for others",
    recommendation: "Join the Legacy Builder Lab to shape your platform, sharpen your message, and build the mentorship model only you can offer."
  }
};

/* ── Q2 → archetype map ── NEED TO FIX */
const Q2_MAP = {
  0: 2,  // Experienced, stuck           → Grounded Giant
  1: 1,  // Mid-level, wants leadership  → Rising Calf
  2: 0,  // Rebuilding (new country/field)→ Nest Rebuilder
  3: 3   // Re-emerging after pause      → Re-Emerging Butterfly
};

/* ── Q1 → archetype map ── */
const Q1_MAP = {
  0: 0,  // New to this country          → Nest Rebuilder
  1: 0,  // Adjusting, new environment   → Nest Rebuilder
  2: 1,  // Integrated, next level       → Rising Calf
  3: 2,  // Home country, stuck          → Grounded Giant
  4: 3   // Working remotely, no path    → Re-Emerging Butterfly
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
  sessionStorage.setItem('resultRightNow',       data.rightNow       || '');
  sessionStorage.setItem('resultNext90',         data.next90         || '');
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