require('dotenv').config();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { validationResult } = require('express-validator');
const validate = require('../model/validation');
const userDB = require('../model/db/user');
const postsDB = require('../model/db/posts');

exports.intro = (req, res) => {
  res.render('intro', { modalId: '', formData: {} });
};

exports.home = async (req, res) => {
  const posts = await postsDB.getPosts();
  res.render('posts', { posts, modalId: '', formData: {} });
};

exports.profile = async (req, res) => {
  if (!req.user) res.redirect('/');
  const { id } = req.params;
  const user = await userDB.getById(id);
  const posts = await postsDB.getUserPosts(id);
  res.render('profile', { user, posts, modalId: '' });
};

exports.deleteUserPost = async (req, res) => {
  const { id } = req.params;
  await userDB.deleteUserPost(id);
  res.redirect(`/profile/${req.user.id}`);
};

exports.admin = (req, res) => {
  res.render('admin', { modalId: '' });
};

exports.createUser = [
  validate.signUp,
  async (req, res, next) => {
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body)
      const posts = await postsDB.getPosts();
      return res.status(400).render(view, {
        posts,
        modalId: 'signUpModal',
        errors: errors.array(),
        formData: req.body,
      });
    }
    try {
      const {
        firstName,
        lastName,
        newUsername,
        newPassword,
      } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await userDB.createUser(firstName, lastName, newUsername, hashedPassword);
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
      const posts = await postsDB.getPosts();
      return res.status(400).render(view, { posts, modalId: 'logInModal', errors: errors.array() });
    }
    passport.authenticate('local', async (error, user) => {
      if (error) return next(error);
      if (!user) {
        const posts = await postsDB.getPosts();
        return res.status(400).render(view, {
          posts,
          modalId: 'logInModal',
          errors: [{ msg: 'Username and Password do not match' }],
          formData: {},
        });
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

exports.createPost = [
  validate.message,
  async (req, res, next) => {
    const view = req.session.previousPath !== '/' ? 'posts' : 'intro';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const posts = await postsDB.getPosts();
      return res.status(400).render(view, {
        posts,
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
      await postsDB.createPost(message);
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
      const posts = await postsDB.getPosts();
      res.status(400).render(view, {
        posts,
        errors: [{ msg: 'Incorrect Passcode' }],
        modalId: 'passcodeModal',
      });
    } else {
      await userDB.addToClub(req.user.id);
      res.redirect(req.session.previousPath);
    }
  },
];

exports.adminSignUp = [
  async (req, res) => {
    if (!req.user) res.redirect('/');
    const usernameMatch = req.body.adminUsername === process.env.ADMIN_USERNAME;
    const passwordMatch = req.body.adminPassword === process.env.ADMIN_PASSWORD;
    if (usernameMatch && passwordMatch) {
      await userDB.grantAdmin(req.user.id);
      res.redirect('/');
    } else {
      res.status(400).render('admin', { modalId: '', errors: [{ msg: 'Incorrect credentials' }] });
    }
  },
];
