require('dotenv').config();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { validationResult } = require('express-validator');
const validate = require('../model/validation');
const userDB = require('../model/db/user');
const messageDB = require('../model/db/message');

exports.intro = (req, res) => {
  res.render('intro', { modalId: '' });
};

exports.home = async (req, res) => {
  const messages = await messageDB.getMessages();
  res.render('posts', { messages, modalId: '' });
};

exports.createUser = [
  validate.signUp,
  async (req, res, next) => {
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = await messageDB.getMessages();
      return res.status(400).render(view, { messages, modalId: 'signUpModal', errors: errors.array() });
    }
    try {
      const {
        first_name,
        last_name,
        new_username,
        new_password
      } = req.body;
      const hashedPassword = await bcrypt.hash(new_password, 12);
      await userDB.createUser(first_name, last_name, new_username, hashedPassword);
      return res.redirect(req.session.previousPath);
    } catch (error) {
      return next(error);
    }
  },
];

exports.logInUser = [
  validate.logIn,
  async (req, res, next) => {
    const errors = validationResult(req);
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    if (!errors.isEmpty()) {
      const messages = await messageDB.getMessages();
      return res.status(400).render(view, { messages, modalId: 'logInModal', errors: errors.array() });
    }
    passport.authenticate('local', async (error, user) => {
      if (error) return next(error);
      if (!user) {
        const messages = await messageDB.getMessages();
        return res.status(400).render(view, { messages, modalId: 'logInModal', errors: [{ msg: 'Username and Password do not match' }] });
      }
      return req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/posts');
      });
    })(req, res, next);
  },
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
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = await messageDB.getMessages();
      return res.status(400).render(view, {
        messages,
        errors: errors.array(),
        modalId: 'messageModal',
      });
    }
    try {
      const message = {
        title: req.body.title,
        message: req.body.message,
        date: new Date().toLocaleString(),
        authorId: req.user.id,
        authorUsername: req.user.username,
      };
      await messageDB.createMessage(message);
      return res.redirect(req.session.previousPath);
    } catch (error) {
      return next(error);
    }
  },
];

exports.checkPasscode = [
  async (req, res) => {
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    const match = req.body.passcode === process.env.PASSCODE;
    if (!match) {
      const messages = await messageDB.getMessages();
      res.status(400).render(view, {
        messages,
        errors: [{ msg: 'Incorrect Passcode' }],
        modalId: 'passcodeModal',
      });
    } else {
      await userDB.addToClub(req.user.id);
      res.redirect(req.session.previousPath);
    }
  },
];
