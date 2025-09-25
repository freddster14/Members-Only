const validate = require('../model/validation');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const db = require('../model/db/user');

exports.home = (req, res) => {
  res.render('index');
};

exports.signUp = (req, res) => {
  res.render('sign-up', { errors: [] });
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up', { errors: errors.array() });
    }
    try {
      const { username, password } = req.body;
      const user = 
      const match = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
]
