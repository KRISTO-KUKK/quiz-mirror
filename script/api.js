/* ── API.JS — HTTP helper, token haldus ── */

const API = '/api';
let authToken = sessionStorage.getItem('authToken') || null;

async function apiFetch(path, method, body) {
  const options = {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(API + path, options);
  if (res.status === 401) {
    authToken = null;
    sessionStorage.removeItem('authToken');
    goTo('screen-access');
    throw new Error('Session expired');
  }
  return res.json();
}

function setAuthToken(token) {
  authToken = token;
  if (token) {
    sessionStorage.setItem('authToken', token);
  } else {
    sessionStorage.removeItem('authToken');
  }
}