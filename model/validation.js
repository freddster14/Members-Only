const { body } = require('express-validator');
const userDB = require('./db/user');

exports.signUp = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .bail()
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('First name must contain only letters, spaces, or hyphens'),
  body('last_name')
    .trim()
    .optional({ values: 'falsy' })
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Last name must contain only letters, spaces, or hyphens'),
  body('new_username')
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty')
    .bail()
    .matches(/^[\w\s-]+$/)
    .withMessage('Username must contain only letters, numbers, spaces, underscores, or hyphens')
    .custom(async (value) => {
      const user = await userDB.getByUsername(value);
      if (user) {
        throw new Error('Username aleady taken');
      }
    }),
  body('new_password')
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password too small'),
  body('password_confirmation')
    .trim()
    .notEmpty()
    .withMessage('Password confirmation is required')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

exports.logIn = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty'),
];

exports.message = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Title too long'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is missing')
    .bail()
    .isLength({ max: 200 }),
];
