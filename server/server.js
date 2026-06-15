require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/(?:^|;\s*)userToken=([^;]+)/);
  if (!match) return res.redirect('/access');
  try {
    jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.redirect('/access');
  }
}

const app = express();

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
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));