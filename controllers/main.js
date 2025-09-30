const validate = require('../model/validation');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { validationResult } = require('express-validator');
const db = require('../model/db/user');

exports.home = (req, res) => {
  res.render('index', { errors: [] });
};

exports.createUser = [
  validate.signUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up', { errors: errors.array() });
    }
    try {
      const { first_name, last_name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      await db.createUser(first_name, last_name, username, hashedPassword);
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
];

exports.logIn = (req, res) => {
  res.render('log-in', { errors: [] });
};

exports.logInUser = [
  validate.logIn,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('log-in', { errors: errors.array() });
    }
    res.locals.currentUser = req.user;
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  }),
];

exports.logOut = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
