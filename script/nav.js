/* ── NAV.JS — Ekraanide vahel liikumine ── */

function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  if (el.dataset.hide === 'visibility') {
    el.style.visibility = 'visible';
  } else {
    el.style.display = 'block';
  }
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (el.dataset.hide === 'visibility') {
    el.style.visibility = 'hidden';
  } else {
    el.style.display = 'none';
  }
}