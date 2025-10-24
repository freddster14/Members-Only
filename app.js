require('./config/passport');
const express = require('express');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const PGSession = require('connect-pg-simple')(session);
const pool = require('./model/db/pool');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const mainRouter = require('./routes/main');

dayjs.extend(relativeTime);

const app = express();
const PORT = 3000;
const assetsPath = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: new PGSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5,
    httpOnly: true,
  },
}));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.dayjs = dayjs;
  if (req.method === 'GET' && !req.path.startsWith('/.well-known')) req.session.previousPath = req.path;
  next();
});
app.use('/', mainRouter);

app.listen(PORT);
