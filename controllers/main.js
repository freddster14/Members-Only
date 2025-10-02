const validate = require('../model/validation');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { validationResult } = require('express-validator');
const userDB = require('../model/db/user');
const messageDB = require('../model/db/message');

exports.home = async (req, res) => {
  const limit = 10;
  const messages = await messageDB.getMessages(limit);
  res.render('index', { messages, errors: [] });
};

exports.createUser = [
  validate.signUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up', { errors: errors.array() });
    }
    try {
      const { first_name, last_name, new_username, new_password } = req.body;
      const hashedPassword = await bcrypt.hash(new_password, 12);
      await userDB.createUser(first_name, last_name, new_username, hashedPassword);
      return res.redirect('/');
    } catch (error) {
      return next(error);
    }
  },
];

exports.logInUser = [
  validate.logIn,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', { errors: errors.array() });
    }
    res.locals.currentUser = req.user;
    return next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  }),
];

exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('/');
  });
};

exports.createMessage = [
  validate.message,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        errors: errors.array(),
        openModal: 'messageModal',
      });
    }
    try {
      const message = {
        title: req.body.title,
        message: req.body.message,
        authorId: req.user.id,
        authorUsername: req.user.username,
      };
      await messageDB.createMessage(message);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
];
