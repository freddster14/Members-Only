const pool = require('./pool');

exports.createUser = async (firstName, lastName, username, password) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, username, status, password) VALUES($1, $2, $3, $4, $5)',
    [
      firstName,
      lastName,
      username,
      'guest',
      password,
    ],
  );
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

exports.getByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
};

exports.addToClub = async (id) => {
  await pool.query('UPDATE users SET status=$1 WHERE id=$2', ['member', id]);
}
