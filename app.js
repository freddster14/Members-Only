require('dotenv').config();
const express = require('express');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const mainRouter = require('./routes/main');


const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use('/', mainRouter);

app.listen(PORT);
