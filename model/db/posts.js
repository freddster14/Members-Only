const pool = require('./pool');

exports.createPost = async (content) => {
  await pool.query(
    'INSERT INTO posts (title, message, author_id, author_username) VALUES ($1,$2,$3,$4)',
    [
      content.title,
      content.message,
      content.authorId,
      content.authorUsername,
    ],
  );
};

exports.getPosts = async (limit) => {
  const { rows } = await pool.query('SELECT * FROM posts ORDER BY id DESC LIMIT $1 ', [limit]);
  return rows;
};

exports.getUserPosts = async (id) => {
  const { rows } = await pool.query('SELECT * FROM posts WHERE author_id=$1', [id]);
  return rows;
};
