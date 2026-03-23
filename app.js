const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ==================== FLAGS ====================
const FLAGS = {
  ch1: 'flag{you_can_see_my_secrets!}',
  ch2: 'flag{nom_nom_cookies_are_yummy}',
  ch3: 'flag{robots_cant_keep_secrets}',
  ch4: 'flag{photos_never_forget}',
  ch5: 'flag{sherlock_of_the_server}',
  ch6: 'flag{not_everything_is_what_it_seems}',
};

// Initialize solved cookie
app.use((req, res, next) => {
  if (!req.cookies.solved) {
    res.cookie('solved', JSON.stringify([]), { httpOnly: false });
    req.cookies.solved = '[]';
  }
  next();
});

// ==================== HOME ====================
app.get('/', (req, res) => {
  const solved = JSON.parse(req.cookies.solved || '[]');
  res.render('index', { solved });
});

// ==================== SUBMIT FLAG ====================
app.post('/submit', (req, res) => {
  const { challenge, flag } = req.body;
  const solved = JSON.parse(req.cookies.solved || '[]');

  if (FLAGS[challenge] && flag.trim() === FLAGS[challenge]) {
    if (!solved.includes(challenge)) {
      solved.push(challenge);
      res.cookie('solved', JSON.stringify(solved), { httpOnly: false });
    }
    // Return the learn-more URL for the educational page
    const chNum = challenge.replace('ch', '');
    return res.json({
      success: true,
      message: '🎉 Correct! Amazing work!',
      learnMoreUrl: `/learn/${chNum}`,
    });
  }
  return res.json({ success: false, message: '❌ Not quite — try again!' });
});

// Reset progress
app.get('/reset', (req, res) => {
  res.cookie('solved', JSON.stringify([]));
  res.redirect('/');
});

// ==================== CHALLENGE 1: View Source ====================
app.get('/challenge/1', (req, res) => {
  res.render('ch1');
});

// ==================== CHALLENGE 2: Cookies ====================
app.get('/challenge/2', (req, res) => {
  res.cookie('secret_flag', FLAGS.ch2, { httpOnly: false });
  res.cookie('decoy_1', 'not_a_flag_haha', { httpOnly: false });
  res.cookie('decoy_2', 'try_harder', { httpOnly: false });
  res.render('ch2');
});

// ==================== CHALLENGE 3: Robots.txt ====================
app.get('/challenge/3', (req, res) => {
  res.render('ch3');
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /super-secret-diary/

# Note to self: don't let anyone find my secret diary page!
# I hope no one reads this file...
`);
});

app.get('/super-secret-diary', (req, res) => {
  res.render('ch3_secret');
});

// ==================== CHALLENGE 4: Photo Metadata ====================
app.get('/challenge/4', (req, res) => {
  res.render('ch4');
});

app.get('/challenge/4/download', (req, res) => {
  res.download(path.join(__dirname, 'challenges', 'evidence.jpg'), 'evidence.jpg');
});

// ==================== CHALLENGE 5: Log Analysis ====================
app.get('/challenge/5', (req, res) => {
  const logContent = fs.readFileSync(
    path.join(__dirname, 'challenges', 'access.log'),
    'utf-8'
  );
  res.render('ch5', { logContent });
});

// ==================== CHALLENGE 6: File Magic Numbers ====================
app.get('/challenge/6', (req, res) => {
  res.render('ch6');
});

app.get('/challenge/6/download', (req, res) => {
  res.download(
    path.join(__dirname, 'challenges', 'mystery_file.dat'),
    'mystery_file.dat'
  );
});

// ==================== EDUCATIONAL PAGES ====================
app.get('/learn/:num', (req, res) => {
  const num = req.params.num;
  const solved = JSON.parse(req.cookies.solved || '[]');
  const chKey = `ch${num}`;

  // Only show learn page if challenge is solved
  if (!solved.includes(chKey)) {
    return res.redirect(`/challenge/${num}`);
  }

  const nextNum = parseInt(num) + 1;
  const hasNext = nextNum <= 6;

  res.render(`learn${num}`, { flag: FLAGS[chKey], nextNum, hasNext });
});

// ==================== START ====================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🔐 EECS Girls Who Tech Camp — CTF Challenge`);
  console.log(`👉 Open your browser: http://localhost:${PORT}\n`);
});
