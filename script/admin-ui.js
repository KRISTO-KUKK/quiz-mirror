/* ── ADMIN-UI.JS ── */

const ADMIN_TOKEN_KEY = 'adminToken';

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function saveAdminToken(token) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;
  if (!username || !password) {
    showError('error-login', 'Please enter username and password.');
    return;
  }

  try {
    const res  = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError('error-login', data.error || 'Invalid credentials.');
      return;
    }
    saveAdminToken(data.token);
    showDashboard();
  } catch {
    showError('error-login', 'Connection error. Please try again.');
  }
}

function logout() {
  clearAdminToken();
  document.getElementById('view-dashboard').style.display = 'none';
  document.getElementById('view-login').style.display     = 'flex';
  document.getElementById('admin-username').value = '';
  document.getElementById('admin-password').value = '';
}

function showDashboard() {
  document.getElementById('view-login').style.display     = 'none';
  document.getElementById('view-dashboard').style.display = 'block';
  loadStats();
  loadLog();
}

async function adminFetch(path) {
  const token = getAdminToken();
  const res   = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 403) {
    logout();
    throw new Error('Session expired');
  }
  return res.json();
}

async function loadStats() {
  try {
    const data = await adminFetch('/api/admin/stats');
    document.getElementById('stat-started').textContent   = data.total_started   ?? '—';
    document.getElementById('stat-completed').textContent = data.total_completed  ?? '—';
    document.getElementById('stat-abandoned').textContent = data.total_abandoned  ?? '—';
    document.getElementById('stat-rate').textContent      =
      data.completion_rate != null ? data.completion_rate + '%' : '—';
    document.getElementById('stat-dropoff').textContent   =
      data.avg_dropoff != null ? 'Q' + data.avg_dropoff : '—';
  } catch { /* session expired — already redirected */ }
}

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function loadLog() {
  const tbody = document.getElementById('log-tbody');
  try {
    const rows = await adminFetch('/api/admin/log');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#aaa;padding:40px;">No data yet.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${esc(r.name)}</td>
        <td>${esc(r.email)}</td>
        <td>${r.started_at   ? new Date(r.started_at).toLocaleString()   : '—'}</td>
        <td>${r.completed_at ? new Date(r.completed_at).toLocaleString() : '—'}</td>
        <td>${esc(r.status)}</td>
        <td>${r.last_question != null ? r.last_question : '—'}</td>
        <td>${esc([r.result_stage, r.result_archetype].filter(Boolean).join(' / ')) || '—'}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#c0392b;padding:40px;">Failed to load data.</td></tr>';
  }
}

// Kui token on juba olemas (leht laeti uuesti), näita kohe töölauad
(function init() {
  if (getAdminToken()) {
    showDashboard();
  }
})();
