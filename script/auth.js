/* ── AUTH.JS — Autentimine ── */

async function sendCode() {
  const name  = document.getElementById('input-name').value.trim();
  const email = document.getElementById('input-email').value.trim();
  if (!name || !email) {
    showError('error-access', 'Please fill in your name and email.');
    return;
  }

  const btn = document.querySelector('#screen-access .btn-gold');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError('error-access', data.error || 'Failed to send code.');
      return;
    }
    // Dev mode: kui backend tagastab koodi otse, näita seda
    const hint = document.getElementById('dev-code-hint');
    if (hint) {
      hint.textContent = data.code
        ? `Dev mode — kood: ${data.code}`
        : '';
    }
    document.getElementById('modal-email').classList.add('open');
  } catch (err) {
    showError('error-access', 'Connection error. Please try again.');
  } finally {
    btn.textContent = 'Send code';
    btn.disabled = false;
  }
}

async function enterCode() {
  const email = document.getElementById('input-email').value.trim();
  const code  = document.getElementById('input-code').value.trim();
  if (!code) {
    showError('error-modal', 'Please enter the access code.');
    return;
  }

  const btn = document.querySelector('#modal-email .btn-dark');
  btn.textContent = 'Verifying...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError('error-modal', data.error || 'Invalid code.');
      return;
    }
    sessionStorage.setItem('userName',  data.name      || '');
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('sessionId', data.sessionId || '');
    closeModal();
    window.location.href = '/quiz';
  } catch (err) {
    showError('error-modal', 'Connection error. Please try again.');
  } finally {
    btn.textContent = 'Enter';
    btn.disabled = false;
  }
}

function closeModal() {
  document.getElementById('modal-email').classList.remove('open');
}