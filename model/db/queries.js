const pool = require('./pool');

exports.createUser = async (firstName, lastName, username, password) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, username, status, password) VALUES($1, $2, $3, "guest", $4)',
    [
      firstName,
      lastName,
      username,
      password,
    ],
  );
};
