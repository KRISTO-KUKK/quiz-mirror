/* ── SCORING.JS — Üks tõeallikas hindamisloogikale ── */

const ARCHETYPES = [
  'Nest Rebuilder',        // 0
  'Rising Calf',           // 1
  'Grounded Giant',        // 2
  'Re-Emerging Butterfly'  // 3
];

const Q1_MAP = {
  0: 0,  // New to this country          → Nest Rebuilder
  1: 0,  // Adjusting, new environment   → Nest Rebuilder
  2: 1,  // Integrated, next level       → Rising Calf
  3: 2,  // Home country, stuck          → Grounded Giant
  4: 3   // Working remotely, no path    → Re-Emerging Butterfly
};

const Q2_MAP = {
  0: 2,  // Experienced, stuck             → Grounded Giant
  1: 1,  // Mid-level, wants leadership    → Rising Calf
  2: 0,  // Rebuilding (new country/field) → Nest Rebuilder
  3: 3   // Re-emerging after pause        → Re-Emerging Butterfly
};

function calculateStage(answers) {
  const score = answers.reduce((sum, v) => sum + (v ?? 0), 0);
  if (score <= 8)  return 'Surviving';
  if (score <= 16) return 'Stabilising';
  return 'Strategising';
}

function calculateArchetype(answers2) {
  const tag1 = Q1_MAP[answers2[0] ?? 0];
  const tag2 = Q2_MAP[answers2[1] ?? 0];
  return (tag1 === tag2) ? tag1 : tag2;
}

module.exports = { ARCHETYPES, calculateStage, calculateArchetype };
