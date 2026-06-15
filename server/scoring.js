/* ── SCORING.JS — Üks tõeallikas hindamisloogikale ── */

const ARCHETYPES = [
  'Nest Rebuilder',        // 0
  'Rising Calf',           // 1
  'Grounded Giant',        // 2
  'Re-Emerging Butterfly'  // 3
];

// Arhetüüp määratakse 2. sektsiooni teise küsimuse põhjal (eluetapp).
// Esimene küsimus (töökontekst) salvestatakse, kuid ei mõjuta praegu arhetüüpi.
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
  return Q2_MAP[answers2[1] ?? 0];
}

module.exports = { ARCHETYPES, calculateStage, calculateArchetype };
