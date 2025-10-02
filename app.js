require('dotenv').config();
const express = require('express');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const mainRouter = require('./routes/main');
require('./config/passport');

const app = express();
const PORT = 3000;
const assetsPath = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
  },
}));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});
app.use('/', mainRouter);

app.listen(PORT);
