const passport = require('passport');
const bcryptjs = require('bcryptjs');
const LocalStragety = require('passport-local').Strategy;
const db = require('../model/db/user');

passport.use(
  new LocalStragety(async (username, password, done) => {
    try {
      const user = db.getByUsername(username);
      if (!user) return done(null, false, { msg: 'Incorrect Username' });
      const match = bcryptjs.compare(password, user.password);
      if (!match) return done(null, false, { msg: 'Incorrect Password' });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
