require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const initDatabase = require('./init-db');
const { requireAuth } = require('./middleware/auth');

const requiredEnvironmentVariables = [
  'EMAIL_USER',
  'EMAIL_PASS',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH',
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
];

function validateEnvironment() {
  const missing = requiredEnvironmentVariables.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const app = express();
app.set('trust proxy', 1);

// ── VIEW ENGINE ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ── MIDDLEWARE ──
app.use(express.json());
app.use(cors());

// ── STAATILISED FAILID ──
app.use('/style',  express.static(path.join(__dirname, '../')));
app.use('/script', express.static(path.join(__dirname, '../script')));
app.use('/src',    express.static(path.join(__dirname, '../src')));

// ── API ROUTEID ──
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/quiz',  require('./routes/quiz'));
app.use('/api/admin', require('./routes/admin'));

// ── PAGE ROUTEID (EJS vaated) ──

// Landing
app.get('/', (req, res) => {
  res.render('landing');
});

// Access (email + kood)
app.get('/access', (req, res) => {
  res.render('access');
});

app.get('/quiz',    requireAuth, (req, res) => res.render('quiz'));
app.get('/results', requireAuth, (req, res) => res.render('results'));

// Admin
app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    title: 'Page not found',
    message: 'The page you are looking for does not exist.'
  });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('error', {
    status: err.status || 500,
    title: err.title || 'Something went wrong',
    message: err.message || 'An unexpected error occurred.'
  });
});

// ── START ──
const PORT = process.env.PORT || 8118;

async function start() {
  validateEnvironment();
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => console.log(`Running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
