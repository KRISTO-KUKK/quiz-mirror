require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');

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

// Quiz (nõuab autentimist — JWT kontroll lisatakse kui DB on valmis)
app.get('/quiz', (req, res) => {
  res.render('quiz');
});

// Results
app.get('/results', (req, res) => {
  res.render('results');
});

// Admin
app.get('/admin', (req, res) => {
  res.render('admin');
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// ── START ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));